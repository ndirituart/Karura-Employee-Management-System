CREATE TABLE Employees
(
    employeeId      VARCHAR(10)   PRIMARY KEY,
    userId          INTEGER       NOT NULL,
    role            VARCHAR(50),

    firstName       VARCHAR(80)   NOT NULL,
    lastName        VARCHAR(80)   NOT NULL,
    emailId         VARCHAR(150)  NOT NULL,
    mobileNo        VARCHAR(20),
    dateofBirth     DATE,
    gender          VARCHAR(20)   NOT NULL,

    department      VARCHAR(80),
    jobTitle        VARCHAR(120),
    hireDate        TIMESTAMPTZ   NOT NULL,
    employmentType  VARCHAR(20)   NOT NULL,
    monthlySalary   NUMERIC(18,2),
    status          VARCHAR(30),
    county          VARCHAR(60),
    townCity        VARCHAR(60),
    postalAddress   VARCHAR(120),

    createdDate     TIMESTAMPTZ   NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updatedDate     TIMESTAMPTZ,
    deletedDate     TIMESTAMPTZ,
    isDeleted       BOOLEAN       NOT NULL DEFAULT FALSE

    -- CONSTRAINT fk_Employees_Users
    --     FOREIGN KEY (userId) REFERENCES Users (userid)
);

CREATE INDEX ix_Employees_employeeId ON employees (employeeId);
CREATE INDEX ix_Employees_userId     ON employees (userId);