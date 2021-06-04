const inquirer = require('inquirer');
const mysql = require('mysql');


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3000
    port: 3000,

    // Your username
    user: "root",

    // Your password
    password: "808melo",
    database: "employee_db"
});
connection.connect(function(err) {
    if (err) throw err;
    start();
});

//Function to determine what the user wants to do and trigger the appropiate flow.
const intro = function() {
    inquirer.prompt({
        type: "list",
        name: "optionList",
        message: "Select an option below!",
        choices: ["Create a Department", "Create a Role", "Add an Employee", "delete Employee", "Update Employee Role", "Update Employee Manager", "View all Employees", "View all Employees by Department", "View all Employees By Manager", "View the total utilized budget of a Department", "Exit"]
    }).then(function(answers) {
        switch (answers.intro) {
            case "Create a Department":
                newDepartment();
                break;
            case "Create a Role":
                newRole();
                break;
            case "Add an Employee":
                newEmployee();
                break;
            case "delete Employee":
                deleteEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "View all Employees":
                viewAllEmployees();
                break;
            case "View all Employees by Department":
                viewAllEmployeesByDepartment();
                break;
            case "View all Employees By Manager":
                viewAllEmployeesByManager();
                break;
            case "Exit":
                exitApp();
        }
    });
};
//Function to Create a new department
const newDepartment = function() {
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "Name of new department?"
    }).then(function(answers) {
        if (answers.departmentName === "") {
            console.log("Must enter a name, try again :(");
            newDepartment();
        } else {
            connection.query("INSERT INTO department SET ?", {
                name: answers.departmentName
            }, function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Department: "${answers.departmentName}" has been created!`);
                    intro();
                }
            });
        }
    });
};
// Function to Create a new Role
const newRole = function() {
    connection.query("SELECT * FROM department", function(err, data) {
        if (err) {
            console.log(err);
        } else {
            const departmentList = data.map(data => data.name);
            inquirer.prompt([{
                    type: "input",
                    name: "title",
                    message: "What is the title for the new role?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary for this role?"
                },
                {
                    type: "list",
                    name: "departmentName",
                    message: "To what department should we add this role?",
                    choices: departmentList
                }
            ]).then(function(answers) {
                if (answers.title === "" || answers.salary === "" || isNaN(answers.salary)) {
                    console.log("The information provided is incomplete or the salary provided for the new role was not a number, please try again.");
                    newRole();
                } else {
                    let dept = data.find(item => item.name === answers.departmentName);
                    connection.query("INSERT INTO role SET ?", {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: dept.id
                    }, function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`The new Role "${answers.title}" has been created successfully in Department: ${dept.name}`);
                            intro();
                        }
                    });
                }
            });
        }
    });
};

// Function to create an employee
const newEmployee = function() {
    connection.query("SELECT * FROM role", function(err, data) {
        if (err) {
            console.log(err);
        } else {
            const roleList = data.map(data => data.title);
            inquirer.prompt([{
                    type: "input",
                    name: "firstName",
                    message: "What is the first name of the new employee?"
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "What is the last name of the new employee?"
                },
                {
                    type: "list",
                    name: "roleName",
                    message: "What is the role of the new employee?",
                    choices: roleList
                }
            ]).then(function(answers) {
                if (answers.firstName === "" || answers.lastName === "") {
                    console.log("The information provided is incomplete, please try again");
                    newEmployee();
                } else {
                    let role = data.find(item => item.title === answers.roleName);
                    connection.query("SELECT * FROM employee WHERE manager_id=0", function(err, managers) {
                        if (err) {
                            console.log(err);
                        } else {
                            const managerList = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
                            inquirer.prompt([{
                                type: "list",
                                name: "isManager",
                                choices: ["YES", "NO"],
                                message: "Is this employee a manager?"
                            }]).then(function(result) {
                                if (result.isManager === "YES") {
                                    connection.query("INSERT INTO employee SET ?", {
                                        first_name: answers.firstName,
                                        last_name: answers.lastName,
                                        role_id: role.id,
                                        manager_id: 0
                                    }, function(err, res) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(`The new employee "${answers.firstName} ${answers.lastName}" has been created!`);
                                            intro();
                                        }
                                    });
                                } else {
                                    inquirer.prompt([{
                                        type: "list",
                                        name: "managerName",
                                        choices: managerList,
                                        message: "What is the name of the manager?"
                                    }]).then(function(response) {
                                        let managerNameArray = response.managerName.split(" ");
                                        connection.query(`SELECT id FROM employee WHERE first_name ='${managerNameArray[0]}' AND last_name ='${managerNameArray[1]}'`, function(err, mgrId) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                connection.query("INSERT INTO employee SET ?", {
                                                    first_name: answers.firstName,
                                                    last_name: answers.lastName,
                                                    role_id: role.id,
                                                    manager_id: mgrId[0].id
                                                }, function(err, res) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log(`The new employee "${answers.firstName} ${answers.lastName}" has been created!`);
                                                        intro();
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
//Function to delete employee
const deleteEmployee = function() {
    connection.query("SELECT * FROM employee", function(err, data) {
        if (err) {
            console.log(err);
        } else {
            const employeeList = data.map(data => `${data.first_name} ${data.last_name}`);
            inquirer.prompt([{
                type: "list",
                name: "employeeName",
                choices: employeeList,
                message: "Select the employee you wish to update from the list"
            }]).then(function(answers) {
                let employeeArray = answers.employeeName.split("");
                connection.query(`DELETE FROM employee WHERE first_name='${employeeArray[0]}' AND last_name='${employeeArray[1]}'`, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("The employee has been removed from the database!");
                        viewAllEmployees();
                    }
                });
            });
        }
    });
};

//Initialize App
intro();