USE employee_db;

INSERT INTO department (name) VALUES ("Post-Production");
INSERT INTO department (name) VALUES ("Actors");
INSERT INTO department (name) VALUES ("Camera Crew");
INSERT INTO department (name) VALUES ("Lighting");

INSERT INTO role (title, salary, department_id) VALUES ("Effects Specialist", 70, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Editor", 50, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Videographer", 50, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Actor", 100, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Anakin", "Skywalker", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Obi-Wan", "Kenobi", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Mace", "Windu", 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Luke", "Skywalker", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Kylo", "Ren", 5, 1);