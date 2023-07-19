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
                    'View employee by ID',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
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
                case 'View employee by ID':
                    viewEmployeeById();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
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