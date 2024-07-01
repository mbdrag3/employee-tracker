const inquirer = require('inquirer');
const {Pool} = require('pg');

const client = new Pool({
    database: 'employees_db',
    host: 'localhost',
    user: 'postgres',
    password: '',
})

client.connect(function (error) {
    if (error) {`There is a connection error, ${error}`};
    console.log('connected to database');
    runQuestion();
})

const questionOne = {
        name: "answer",
        message: "Choose an action",
        type: "list",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add a employee",
            "Update an employee role",
            "Remove an employee, role, or department",
            "End"
        ],
        pageSize: 10
    }

async function runQuestion() {
    const response = await inquirer.prompt(questionOne);
    console.log(response.answer);

    if (response.answer == 'View all departments') {
        viewDepartments();
    } else if (response.answer == 'View all roles') {
        viewRoles();
    } else if (response.answer == 'View all employees') {
        viewEmployees();
    } else if (response.answer == 'Add a department') {
        addDepartment();
    } else if (response.answer == 'Add a role') {
        addRole();
    } else if (response.answer == 'Add a employee') {
        addEmployee();
    } else if (response.answer == 'Update an employee role') {
        updateEmployeeRole();
    } else if (response.answer == 'Remove an employee, role, or department') {
        deleteQuestion()
    } else {
        endConnection();
    }
}



function viewDepartments () {
    client.query(
        `SELECT * FROM department`
        ).then((response)=>{
            console.table(response.rows)
        }).catch((error)=>{
            console.log('Error retrieving the data', error)
        })
        runQuestion();
}

function viewRoles () {
    client.query(
        `SELECT * FROM role`
        ).then((response)=>{
            console.table(response.rows)
        }).catch((error)=>{
            console.log('Error retrieving the data', error)
        })
        runQuestion();
}

function viewEmployees () {
    client.query(
        `SELECT * FROM employee`
        ).then((response)=>{
            console.table(response.rows)
        }).catch((error)=>{
            console.log('Error retrieving the data', error)
        })
        runQuestion();
}

function addDepartment () {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: 'Please name your department.'
    }]).then(function(response){
        console.log(response.department);
        const departmentName = response.department
        client.query(
           `INSERT INTO department (name) VALUES ($1)`, [departmentName]
        ).then(() => {
            console.log('Congrats! Department added successfully.')
        }).catch((error) => {
            console.log('Error inserting department.', error)
        })
    }).then(()=>{
        runQuestion();
    })
    
}

function addRole () {
    inquirer.prompt([{
        name: "title",
        type: "input",
        message: "Enter a title for the role."
    },
    {
        name: "salary",
        type: "input",
        message: "Enter a salary for the role."
    },
    {
        name: "department_id",
        type: "input",
        message: "Enter the id of the department for the role."
    }
    ]).then(function(response){
        const title = response.title;
        const salary = response.salary;
        const depId = response.department_id;

        client.query(
            `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`, [title,salary,depId]
        ).then(()=>{
            console.log('Role added successfully')
        }).catch((error)=>{
            console.log('Error trying to add the role. Make sure you used a correct department ID', error)
        })
    }).then(()=>{
        runQuestion();
    })
}

function addEmployee () {
    inquirer.prompt([{
        name: "first_name",
        type: "input",
        message: "Please enter an employee first name."
    },
    {
        name: "last_name",
        type: "input",
        message: "Please enter an employee last name."
    },
    {
        name: "role_id",
        type: "input",
        message: "Please enter the id of the role for the employee."
    },
    {
        name: "manager_id",
        type: "input",
        message: "Please enter the id of the manager for the employee."
    }
    ]).then(function(response){
        const firstName = response.first_name;
        const lastName = response.last_name;
        const roleId = response.role_id;
        const managerId = response.manager_id;

        client.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [firstName,  lastName, roleId, managerId]
        ).then(()=>{
            console.log('Employee added successfully')
        }).catch((error)=>{
            console.log('Error trying to add the employee.', error)
        })
    }).then(()=>{
        runQuestion();
    })

}

function updateEmployeeRole () {
    inquirer.prompt([{
        name: "employee_id",
        type: "input",
        message: "Please enter the id of the employee that youd would like to update."
    },
    {
        name: "new_role",
        type: "input",
        message: "Please enter the id of the new role you would like to give the employee."
    }
]).then((response)=>{
    const roleId = response.new_role;
    const employeeId = response.employee_id
    client.query(
        `UPDATE employee SET role_id = ($1) WHERE id = ($2)`, [roleId, employeeId]
    ).then(()=>{
        console.log('Successfully updated the employees role')
    }).catch((error)=>{
        console.log('Error updating', error)
    })
}).then(()=>{
    runQuestion();
})
}

function endConnection () {
    client.end;
}

function deleteQuestion() {
    inquirer.prompt([
        {
        name: "deleteQuestion",
        type: "list",
        choices: ["Delete Employee", "Delete Role", "Delete Department"],
        message: "Please choose which option you would like to delete."
        }
]).then((response)=>{
    
    if (response.deleteQuestion == 'Delete Employee') {
        inquirer.prompt([
            {
            name: "deleteEmployee",
            type: "input",
            message: "Please enter the ID of the employee that you would like to remove."
            }
        ]).then((response)=>{
            client.query(
                `DELETE FROM employee WHERE id=($1);`, [response.deleteEmployee]
            ).then(()=>{
                console.log(`Successfully deleted employee ID: ${response.deleteEmployee}`)
            }).catch((error)=>{
                console.log(`No employee that matches that ID`)
            })
        }).then(()=>{
            runQuestion();
        })
    }
    
    if (response.deleteQuestion == 'Delete Role') {
        inquirer.prompt([
            {
            name: "deleteRole",
            type: "input",
            message: "Please enter the ID of the role that you would like to remove."
            }
        ]).then((response)=>{
            client.query(
                `DELETE FROM role WHERE id=($1);`, [response.deleteRole]
            ).then(()=>{
                console.log(`Successfully deleted role ID: ${response.deleteRole}`)
            }).catch((error)=>{
                console.log(`No role that matches that ID`)
            })
        }).then(()=>{
            runQuestion();
        })
    }

    if (response.deleteQuestion == 'Delete Department') {
        inquirer.prompt([
            {
            name: "deleteDepartment",
            type: "input",
            message: "Please enter the ID of the Deparment that you would like to remove."
            }
        ]).then((response)=>{
            client.query(
                `DELETE FROM department WHERE id=($1);`, [response.deleteDepartment]
            ).then(()=>{
                console.log(`Successfully deleted department ID: ${response.deleteDepartment}`)
            }).catch((error)=>{
                console.log(`No department that matches that ID`)
            })
        }).then(()=>{
            runQuestion();
        })
    }    
})
}