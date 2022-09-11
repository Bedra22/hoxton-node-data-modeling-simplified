import Database from "better-sqlite3";

const db = Database('./db/data.db', { verbose: console.log })

const applicants = [
    {
        id: 1,
        name: "Bedra Kraja",
        email: "bedra@gmil.com"
    },
    {
        id: 2,
        name: "Uarda Kraja",
        email: "uarda@gmil.com"
    },
    {
        id: 3,
        name: "Sejda Kraja",
        email: "sejda@gmil.com"
    },
]
const interviews = [
    {
        applicantsId: 1,
        interviewersId: 1,
        date: "22/09/2022",
        score: 7
    },
    {
        applicantsId: 1,
        interviewersId: 2,
        date: "18/06/2022",
        score: 10
    },
    {
        applicantsId: 2,
        interviewersId: 2,
        date: "30/08/2022",
        score: 9
    },
    {
        applicantsId: 3,
        interviewersId: 1,
        date: "02/09/2022",
        score: 3
    },
    {
        applicantsId: 3,
        interviewersId: 2,
        date: "02/09/2022",
        score: 8
    }
]
const interviewers = [
    {
        id: 1,
        name: "Ed",
        email: "ed.putans@hoxton.com",
        companyId: 1
    },
    {
        id: 2,
        name: "Nicolas",
        email: "nico.marcora@hoxton.com",
        companyId: 2
    }
]
const employees = [
    {
        id: 1,
        name: "Naile Bekteshi",
        email: "naile@gmail.com",
        position: "Menager",
        companyId: 1
    }, {
        id: 1,
        name: "Ylvije Borici",
        email: "ylvije@gmail.com",
        position: "Menager",
        companyId: 2
    }, {
        id: 1,
        name: "Edi Qehaja",
        email: "edi@gmail.com",
        position: "Menager",
        companyId: 1
    }
]
const companies = [
    {
        id: 1,
        name: "Kraja Group",
        city: "Shkoder"
    },
    {
        id: 2,
        name: "Hoxton Group",
        city: "London"
    }
]



const deleteApplicantsTable = db.prepare(`
DROP TABLE IF EXISTS applicants;
`)
deleteApplicantsTable.run()
const createApplicantsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS applicants(
    id INTEGER,
    name TEXT,
    email TEXT,
    PRIMARY KEY (id)
);
`)
createApplicantsTable.run()
const addNewApplicationInTable = db.prepare(`
INSERT INTO applicants (name,email) VALUES (@name,@email)
`)
for (let applicant of applicants) addNewApplicationInTable.run(applicant)


const dropCompaniesTable = db.prepare(`
DROP TABLE IF EXISTS companies;
`)
dropCompaniesTable.run()



const dropEmployeesTable = db.prepare(`
DROP TABLE IF EXISTS employees;
`)
dropEmployeesTable.run()

const createCompaniesTable = db.prepare(`
CREATE TABLE IF NOT EXISTS companies(
    id INTEGER,
    name TEXT,
    city TEXT,
   PRIMARY KEY(id)
);
`)
createCompaniesTable.run()
const addNewCompaniesTable = db.prepare(`
INSERT or IGNORE INTO companies (id,name,city) VALUES (@id,@name,@city);
`)
for (let company of companies) addNewCompaniesTable.run(company)




const deleteInterviewersTable = db.prepare(`
DROP TABLE IF EXISTS interviewers;
`)
deleteInterviewersTable.run()
const createInterviewersTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers(
    id INTEGER,
    name TEXT,
    email TEXT,
    companyId INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (companyId) REFERENCES companies (id) ON DELETE CASCADE
);
`)
createInterviewersTable.run()
const addNewInterviewersInTable = db.prepare(`
INSERT INTO interviewers (name,email,companyId) VALUES (@name,@email,@companyId)
`)
for (let interviewer of interviewers) addNewInterviewersInTable.run(interviewer)



const createInterviewsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER,
    applicantsId INTEGER NOT NULL,
    interviewersId INTEGER NOT NULL,
    date TEXT,
    score INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (applicantsId) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewersId) REFERENCES interviewers(id) ON DELETE CASCADE
);
`)
createInterviewsTable.run()
const addNewInterviewsInTable = db.prepare(`
INSERT INTO interviews (applicantsId,interviewersId, date, score) VALUES (@applicantsId,@interviewersId,@date,@score)
`)
for (let interview of interviews) addNewInterviewsInTable.run(interview)




const createEmployeesTable = db.prepare(`
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER,
    name TEXT,
    email TEXT,
    position TEXT,
    companyId INTEGER,
    PRIMARY KEY(id),
    FOREIGN KEY (companyId) REFERENCES companies (id) ON DELETE CASCADE
  );
`)
createEmployeesTable.run()
const addNewEmployeeInTable = db.prepare(`
INSERT or IGNORE INTO employees (name,email,position,companyId) VALUES ( @name, @email, @position, @companyId);
 `)
for (let employee of employees) addNewEmployeeInTable.run(employee)





