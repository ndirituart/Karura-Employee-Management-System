INSERT INTO employees
    (employeeId, userid, role,
     firstname, lastname, emailid, mobileno, dateofbirth, gender,
     department, jobtitle, hiredate, employmenttype, monthlysalary,
     status, county, towncity, postaladdress,
     createddate, isdeleted)
VALUES
    ('EMP-001', 1, 'Admin',
     'John', 'Doe', 'john.doe@example.com', '+254712345678', '1985-04-12', 'Male',
     'ICT', 'System Administrator', '2020-01-15T08:00:00+03', 'Permanent', 120000.00,
     'Active', 'Nairobi', 'Nairobi', 'P.O. Box 100-00100',
     NOW() AT TIME ZONE 'UTC', FALSE),

    ('EMP-002', 2, 'Forest Manager',
     'Jane', 'Smith', 'jane.smith@example.com', '+254722987654', '1990-09-03', 'Female',
     'Forestry', 'Forest Manager', '2021-03-01T08:00:00+03', 'Permanent', 95000.00,
     'Active', 'Kiambu', 'Kiambu', 'P.O. Box 200-00900',
     NOW() AT TIME ZONE 'UTC', FALSE),

    ('EMP-003', 3, 'Ranger',
     'Samuel', 'Njogu', 'samuel.njogu@example.com', '+254733112233', '1988-01-27', 'Male',
     'Operations', 'Field Ranger', '2019-07-10T08:00:00+03', 'Permanent', 70000.00,
     'Active', 'Kisumu', 'Kisumu', 'P.O. Box 300-40100',
     NOW() AT TIME ZONE 'UTC', FALSE),

    ('EMP-004', 4, 'Ecologist',
     'Grace', 'Wambui', 'grace.wambui@example.com', '+254744556677', '1993-06-19', 'Female',
     'Conservation', 'Ecologist', '2022-02-14T08:00:00+03', 'Permanent', 80000.00,
     'Active', 'Nairobi', 'Nairobi', 'P.O. Box 400-00100',
     NOW() AT TIME ZONE 'UTC', FALSE),

    ('EMP-005', 5, 'Conservation Officer',
     'David', 'Otieno', 'david.otieno@example.com', '+254755889900', '1991-11-05', 'Male',
     'Conservation', 'Conservation Officer', '2020-09-01T08:00:00+03', 'Permanent', 75000.00,
     'Active', 'Nakuru', 'Nakuru', 'P.O. Box 500-20100',
     NOW() AT TIME ZONE 'UTC', FALSE),

    ('EMP-006', 7, 'Admin',
     'Test', 'User', 'test.user@example.com', '+254712345678', '1995-03-22', 'Other',
     'ICT', 'QA Tester', '2024-05-20T08:00:00+03', 'Contract', 60000.00,
     'Active', 'Nairobi', 'Nairobi', 'P.O. Box 600-00100',
     NOW() AT TIME ZONE 'UTC', FALSE),

    ('EMP-007', 8, 'Forest Manager',
 'Patience', 'Ndiritu',
 'ndiritupatience002@gmail.com',       -- emailid   (VARCHAR(150), ok)
 '+254700000008',                      -- mobileno  (fits VARCHAR(20))
 '1994-08-17', 'Female',
 'Forestry', 'Assistant Forest Manager', '2023-08-01T08:00:00+03', 'Permanent', 88000.00,
 'Active', 'Nyeri', 'Nyeri', 'P.O. Box 700-10100',
 NOW() AT TIME ZONE 'UTC', FALSE)