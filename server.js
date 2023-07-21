const express = require('express');
const mysql = require('mysql');
const menu = require('./public/menu'); // Require the menu file from the "public" directory

const app = express();
const port = 3000;

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
});

// Retrieve all departments
app.get('/departments', (req, res) => {
  const query = 'SELECT * FROM department';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving departments:', error);
      res.status(500).json({ error: 'Failed to retrieve departments' });
    } else {
      console.log('Departments:');
      console.table(results);
      res.sendStatus(200);
    }
  });
});

// Add a new department
app.post('/departments', (req, res) => {
  const { name } = req.body;
  const query = 'INSERT INTO department (department_name) VALUES (?)';
  connection.query(query, [name], (error) => {
    if (error) {
      console.error('Error adding department:', error);
      res.status(500).json({ error: 'Failed to add department' });
    } else {
      console.log('Department added successfully');
      res.sendStatus(200);
    }
  });
});

// Retrieve all roles
app.get('/roles', (req, res) => {
  const query = 'SELECT * FROM role';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving roles:', error);
      res.status(500).json({ error: 'Failed to retrieve roles' });
    } else {
      console.log('Roles:');
      console.table(results);
      res.sendStatus(200);
    }
  });
});

// Add a new role
app.post('/roles', (req, res) => {
  const { title, salary, department_id } = req.body;
  const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  connection.query(query, [title, salary, department_id], (error) => {
    if (error) {
      console.error('Error adding role:', error);
      res.status(500).json({ error: 'Failed to add role' });
    } else {
      console.log('Role added successfully');
      res.sendStatus(200);
    }
  });
});

// Retrieve all employees
app.get('/employees', (req, res) => {
  const query = 'SELECT * FROM employee';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving employees:', error);
      res.status(500).json({ error: 'Failed to retrieve employees' });
    } else {
      console.log('Employees:');
      console.table(results);
      res.sendStatus(200);
    }
  });
});

// retrieve employees by manager
app.get('/employees/by-manager/:id', (req, res) => {
  const managerId = req.params.id;
  viewEmployeesByManager(managerId, res);
});

// retrieve employees by department
app.get('/employees/by-department/:id', (req, res) => {
  const departmentId = req.params.id;
  viewEmployeesByDepartment(departmentId, res);
});

// retrieve employee by ID
app.get('/employees/:id', (req, res) => {
    const query = 'SELECT * FROM employee';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error retrieving employee:', error);
        res.status(500).json({ error: 'Failed to retrieve employee' });
      } else {
        console.log('Employee:');
        console.table(results);
        res.sendStatus(200);
      }
    });
  });

// Add a new employee
app.post('/employees', (req, res) => {
  const { first_name, last_name, role_id, manager_id } = req.body;
  const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  connection.query(query, [first_name, last_name, role_id, manager_id], (error) => {
    if (error) {
      console.error('Error adding employee:', error);
      res.status(500).json({ error: 'Failed to add employee' });
    } else {
      console.log('Employee added successfully');
      res.sendStatus(200);
    }
  });
});

// Update an employee's role
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;
  const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
  connection.query(query, [role_id, id], (error) => {
    if (error) {
      console.error('Error updating employee role:', error);
      res.status(500).json({ error: 'Failed to update employee role' });
    } else {
      console.log(`Updated employee role for ID ${id}`);
      res.sendStatus(200);
    }
  });
});

app.put('/employees/:id/manager', (req, res) => {
  const employeeId = req.params.id;
  const newManagerId = req.body.newManagerId; 

  try {
    // Check if newManagerId is a valid number 
    if (isNaN(newManagerId)) {
      throw new Error('Invalid manager ID. Manager ID must be a valid number.');
    }

    // Call the updateEmployeeManager function to update the employee's manager
    updateEmployeeManager(employeeId, newManagerId, res);
  } catch (error) {
    console.error('Error updating employee manager:', error.message);
    res.status(400).send(error.message); // Send a 400 Bad Request status with the error message
  }
});

// Delete employee route
app.delete('/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  deleteEmployee(employeeId, res);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});