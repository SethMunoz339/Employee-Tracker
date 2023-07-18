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
          // Handle view all departments
          break;
        case 'View all roles':
          // Handle view all roles
          break;
        case 'View all employees':
          // Handle view all employees
          break;
        case 'Add a department':
          // Handle add a department
          break;
        case 'Add a role':
          // Handle add a role
          break;
        case 'Add an employee':
          // Handle add an employee
          break;
        case 'Update an employee role':
          // Handle update an employee role
          break;
        case 'Exit':
          console.log('Exiting...');
          process.exit(0);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

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
      // Handle adding the department
      console.log(`Added department: ${answers.name}`);
      displayMainMenu();
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
      // Handle adding the role
      console.log(`Added role: ${answers.name}, Salary: ${answers.salary}, Department: ${answers.department}`);
      displayMainMenu();
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
      // Handle adding the employee
      console.log(`Added employee: ${answers.firstName} ${answers.lastName}, Role: ${answers.role}, Manager: ${answers.manager}`);
      displayMainMenu();
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
      // Handle updating the employee role
      console.log(`Updated employee role for ID ${answers.employeeId} to ${answers.newRole}`);
      displayMainMenu();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Start the application
displayMainMenu();
