INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, 1),
       ('Jane', 'Doe', 1, 1),
       ('Jill', 'Doe', 2, 2),
       ('Bob', 'Builder', 3, 2);

INSERT INTO department (name)
VALUES ('Marketing'),
       ('Sales'),
       ('Operations'),
       ('Warehouse');

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', '100,000', '1'),
       ('Sales Associate', '75,000', '2'),
       ('CEO','150,000', '3'),
       ('Warehouse Manager', '90,000', '4');