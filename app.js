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
            choices: ["Create a Department", "Create a Role", "Add an Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View all Employees", "View all Employees by Department", "View all Employees By Manager", "View the total utilized budget of a Department", "Exit"]
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
                case "Remove Employee":
                    removeEmployee();
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
    }
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

//Initialize App
intro();