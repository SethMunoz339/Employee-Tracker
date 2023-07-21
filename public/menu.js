const inquirer = require('inquirer');
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Z&$110dkioo4?@',
    database: 'employees_db',
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database.');
    displayMainMenu();
});
// Displays the menu in the terminal
function displayMainMenu() {
    console.log('=== Employee Management System ===');
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'View employees by manager',
                    'View employees by department',
                    'View employee by ID',
                    'Add a department',
                    'Delete a department',
                    'Add a role',
                    'Delete a role',
                    'Add an employee',
                    'Delete an employee',
                    'Update an employee role',
                    'Update an employee manager',
                    'Exit'
                ],
            },
        ])
        .then((answers) => {
            switch (answers.option) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'View employees by manager':
                    viewEmployeesByManager();
                    break;
                case 'View employees by department':
                    viewEmployeesByDepartment();
                    break;
                case 'View employee by ID':
                    viewEmployeeById();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Delete a department':
                    deleteDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Delete a role':
                    deleteRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Update an employee manager':
                    updateEmployeeManager();
                    break;
                case 'Exit':
                    console.log('Exiting...');
                    connection.end();
                    process.exit(0);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
// Function for viewing departments
function viewAllDepartments() {
    const query = 'SELECT * FROM department';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving departments:', error);
        } else {
            console.table(results);
        }
        displayMainMenu();
    });
}
// Function for viewing roles
function viewAllRoles() {
    const query = 'SELECT * FROM role';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving roles:', error);
        } else {
            console.table(results);
        }
        displayMainMenu();
    });
}
// Function for viewing all employees
const viewAllEmployees = () => {
    const query = `SELECT 
                      e.id AS employee_id,
                      e.first_name,
                      e.last_name,
                      r.title AS role,
                      d.department_name AS department,
                      r.salary,
                      CONCAT(m.first_name, ' ', m.last_name) AS manager
                  FROM 
                      employee e
                  INNER JOIN 
                      role r ON e.role_id = r.id
                  INNER JOIN 
                      department d ON r.department_id = d.id
                  LEFT JOIN 
                      employee m ON e.manager_id = m.id`;

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving employees:', error);
        } else {
            const formattedResults = results.map((employee) => {
                return {
                    Employee_ID: employee.employee_id,
                    First_Name: employee.first_name,
                    Last_Name: employee.last_name,
                    Role: employee.role,
                    Department: employee.department,
                    Salary: employee.salary,
                    Manager: employee.manager || 'N/A',
                };
            });
            console.table(formattedResults);
        }
        displayMainMenu();
    });
};
// Function for viewing employees by manager
const viewEmployeesByManager = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'managerId',
                message: 'Enter the ID of the manager:'

            },
        ])
        .then((answers) => {
            if (answers.managerId) {
                const managerId = answers.managerId;
                const query = `SELECT 
                            e.id AS employee_id,
                            e.first_name,
                            e.last_name,
                            r.title AS role,
                            d.department_name AS department,
                            r.salary
                        FROM 
                            employee e
                        INNER JOIN 
                            role r ON e.role_id = r.id
                        INNER JOIN 
                            department d ON r.department_id = d.id
                        WHERE 
                            e.manager_id = ?`;

                connection.query(query, [managerId], (error, results) => {
                    if (error) {
                        console.error('Error retrieving employees:', error);
                        return;
                    }

                    if (results.length === 0) {
                        console.log('No employees found for this manager.');
                    } else {
                        const formattedResults = results.map((employee) => {
                            return {
                                Employee_ID: employee.employee_id,
                                First_Name: employee.first_name,
                                Last_Name: employee.last_name,
                                Role: employee.role,
                                Department: employee.department,
                                Salary: employee.salary,
                            };
                        });
                        console.table(formattedResults);
                    }
                    displayMainMenu();
                });
            } else {
                displayMainMenu();
            }
        })
        .catch((error) => {
            console.error(error);
        });
};
// Function for viewing employees by department
const viewEmployeesByDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentId',
                message: 'Enter the ID of the department:'

            },
        ])
        .then((answers) => {
            if (answers.departmentId) {
                const departmentId = answers.departmentId;
                const query = `SELECT 
                            e.id AS employee_id,
                            e.first_name,
                            e.last_name,
                            r.title AS role,
                            d.department_name AS department,
                            r.salary
                        FROM 
                            employee e
                        INNER JOIN 
                            role r ON e.role_id = r.id
                        INNER JOIN 
                            department d ON r.department_id = d.id
                        WHERE 
                            e.department_id = ?`;

                connection.query(query, [departmentId], (error, results) => {
                    if (error) {
                        console.error('Error retrieving employees:', error);
                        return;
                    }

                    if (results.length === 0) {
                        console.log('No employees found for this department.');
                    } else {
                        const formattedResults = results.map((employee) => {
                            return {
                                Employee_ID: employee.employee_id,
                                First_Name: employee.first_name,
                                Last_Name: employee.last_name,
                                Role: employee.role,
                                Department: employee.department,
                                Salary: employee.salary,
                            };
                        });
                        console.table(formattedResults);
                    }
                    displayMainMenu();
                });
            } else {
                displayMainMenu();
            }
        })
        .catch((error) => {
            console.error(error);
        });
};
// Function for viewing employees by employee ID
const viewEmployeeById = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the ID of the employee:',
            },
        ])
        .then((answers) => {
            const query = `SELECT 
                          e.id AS employee_id,
                          e.first_name,
                          e.last_name,
                          r.title AS role,
                          d.department_name AS department,
                          r.salary,
                          CONCAT(m.first_name, ' ', m.last_name) AS manager
                      FROM 
                          employee e
                      INNER JOIN 
                          role r ON e.role_id = r.id
                      INNER JOIN 
                          department d ON r.department_id = d.id
                      LEFT JOIN 
                          employee m ON e.manager_id = m.id
                      WHERE 
                          e.id = ?`;

            connection.query(query, [answers.employeeId], (error, results) => {
                if (error) {
                    console.error('Error retrieving employee:', error);
                    res.status(500).send('Error retrieving employee.');
                } else if (results.length === 0) {
                    console.log('Employee not found.');
                    res.status(404).send('Employee not found.');
                } else {
                    const employee = results[0];
                    const employeeInfo = [{
                        Employee_ID: employee.employee_id,
                        First_Name: employee.first_name,
                        Last_Name: employee.last_name,
                        Role: employee.role,
                        Department: employee.department,
                        Salary: employee.salary,
                        Manager: employee.manager || 'N/A'
                    }];
                    console.table(employeeInfo);
                }

                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
};
// function for creating a new department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the department:',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO department (department_name) VALUES (?)';
            connection.query(query, [answers.name], (error) => {
                if (error) {
                    console.error('Error adding department:', error);
                } else {
                    console.log(`Added department: ${answers.name}`);
                }
                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
}
// function for deleting a department
const deleteDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentId',
                message: 'Enter the ID of the department to delete:',
            },
        ])
        .then((answers) => {
            const departmentId = answers.departmentId;
            const query = 'DELETE FROM department WHERE id = ?';
            connection.query(query, [departmentId], (error) => {
                if (error) {
                    console.error('Error deleting department:', error);
                } else {
                    console.log(`Deleted department with ID ${departmentId}`);
                }
                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
};
// function for creating a new role
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the role:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:',
            },
            {
                type: 'input',
                name: 'department',
                message: 'Enter the department for the role:',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(query, [answers.name, answers.salary, answers.department], (error) => {
                if (error) {
                    console.error('Error adding role:', error);
                } else {
                    console.log(`Added role: ${answers.name}, Salary: ${answers.salary}, Department: ${answers.department}`);
                }
                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

// function for deleting a role
const deleteRole = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleId',
                message: 'Enter the ID of the role to delete:',
            },
        ])
        .then((answers) => {
            const roleId = answers.roleId;
            const query = 'DELETE FROM role WHERE id = ?';
            connection.query(query, [roleId], (error) => {
                if (error) {
                    console.error('Error deleting role:', error);
                } else {
                    console.log(`Deleted role with ID ${roleId}`);
                }
                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

// function for creating a new employee
function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the first name of the employee:',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the last name of the employee:',
            },
            {
                type: 'input',
                name: 'role',
                message: 'Enter the role of the employee:',
            },
            {
                type: 'input',
                name: 'manager',
                message: 'Enter the manager of the employee:',
            },
        ])
        .then((answers) => {
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            connection.query(query, [answers.firstName, answers.lastName, answers.role, answers.manager], (error) => {
                if (error) {
                    console.error('Error adding employee:', error);
                } else {
                    console.log(`Added employee: ${answers.firstName} ${answers.lastName}, Role: ${answers.role}, Manager: ${answers.manager}`);
                }
                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
}

// function for deleting an employee
const deleteEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the ID of the employee to delete:',
            },
        ])
        .then((answers) => {
            const employeeId = answers.employeeId;
            const query = 'DELETE FROM employee WHERE id = ?';
            connection.query(query, [employeeId], (error) => {
                if (error) {
                    console.error('Error deleting employee:', error);
                } else {
                    console.log(`Deleted employee with ID ${employeeId}`);
                }
                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

// function for updating an employee role
function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the ID of the employee to update:',
            },
            {
                type: 'input',
                name: 'newRole',
                message: 'Enter the new role for the employee:',
            },
        ])
        .then((answers) => {
            const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
            connection.query(query, [answers.newRole, answers.employeeId], (error) => {
                if (error) {
                    console.error('Error updating employee role:', error);
                } else {
                    console.log(`Updated employee role for ID ${answers.employeeId} to ${answers.newRole}`);
                }
                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
};

// function for updating an employee manager
function updateEmployeeManager() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the ID of the employee to update:',
            },
            {
                type: 'input',
                name: 'newManager',
                message: 'Enter the new manager for the employee:',
            },
        ])
        .then((answers) => {
            const query = 'UPDATE employee SET manager_id = ? WHERE id = ?';
            connection.query(query, [answers.newManager, answers.employeeId], (error) => {
                if (error) {
                    console.error('Error updating employee manager:', error);
                } else {
                    console.log(`Updated employee manager for ID ${answers.employeeId} to ${answers.newManager}`);
                }
                displayMainMenu();
            });
        })
        .catch((error) => {
            console.error(error);
        });
};