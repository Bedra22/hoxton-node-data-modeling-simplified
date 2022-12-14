import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const db = Database('./db/data.db', { verbose: console.log })
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

const getInterviewersById = db.prepare(`
SELECT * FROM interviewers WHERE id=@id;
`)

const getApplicantsById = db.prepare(`
SELECT * FROM applicants WHERE id=@id;
`)

const getInterviewById = db.prepare(`
SELECT * FROM interviews WHERE id=@id;
`)

const getCompaniesById = db.prepare(`
SELECT * FROM companies WHERE id=@id;
`)

const getEmployesById = db.prepare(`
SELECT * FROM employees WHERE id=@id; 
`)

const getInterviewDoneByApplicants = db.prepare(`
SELECT * FROM interviews WHERE applicantsId=@applicantsId;
`)

const getInterviewDoneForInterviewers = db.prepare(`
SELECT * FROM interviews WHERE interviewersId=@interviewersId;
`)

const interviewersThatInterviewedApplicants = db.prepare(`
SELECT interviewers.* FROM interviewers 
JOIN interviews ON interviewers.id=interviews.interviewersId
 WHERE interviews.applicantsId=@applicantsId; 
`)

const applicantsInterviewedByInteviewers = db.prepare(`
SELECT applicants.* FROM applicants 
JOIN interviews ON applicants.id=interviews.applicantsId
WHERE interviews.interviewersId=@interviewersId;
`)

const interviewersInCompany = db.prepare(`
SELECT * FROM interviewers WHERE interviewers.companyId=?;
`)

const employeesInCompany = db.prepare(`
SELECT * FROM employees WHERE employees.companyId=?;
`)


const addNewApplicationInTable = db.prepare(`
INSERT INTO applicants (name,email) VALUES (@name,@email)
`)

const addNewInterviewersInTable = db.prepare(`
INSERT INTO interviewers (name,email) VALUES (@name,@email)
`)


const addNewInterviewsInTable = db.prepare(`
INSERT INTO interviews (applicantsId,interviewersId, date, score) VALUES (@applicantsId,@interviewersId,@date,@score)
`)


const addNewCompaniesTable = db.prepare(`
INSERT or IGNORE INTO companies (name,city) VALUES (@name,@city);
`)

const updateInterview = db.prepare(`
UPDATE interviews SET applicantsId=@applicantsId , interviewersId=@interviewersId , date=@date ,successful=@successful , score=@score WHERE id=@id;
`)

const fireEmployees = db.prepare(`
DELETE FROM employees WHERE id=@id;
`)

app.get('/', (req, res) => {
    res.send(`<h1>Yayyy</h1>`)
})


app.get('/applicants/:id', (req, res) => {

    const applicant = getApplicantsById.get(req.params)

    if (applicant) {
        applicant.interview = getInterviewDoneByApplicants.all({ applicantsId: applicant.id })
        applicant.interviewers = interviewersThatInterviewedApplicants.all({ applicantsId: applicant.id })
        res.send(applicant)
    } else {
        res.status(404).send("Applicant not found")
    }
})

app.get('/interviewers/:id', (req, res) => {

    const interviewer = getInterviewersById.get(req.params)

    if (interviewer) {
        interviewer.interview = getInterviewDoneForInterviewers.all({ interviewersId: interviewer.id })
        interviewer.applicant = applicantsInterviewedByInteviewers.all({ interviewersId: interviewer.id })
        res.send(interviewer)
    } else {
        res.status(404).send("Interviewer not found")
    }
})


app.get('/companies/:id', (req, res) => {

    const company = getCompaniesById.get(req.params)

    if (company) {
        company.interviewer = interviewersInCompany.all(company.id)
        company.employee = employeesInCompany.all(company.id)
        res.send(company)
    } else {
        res.status(404).send("Company not found")
    }
})


app.post('/applicants', (req, res) => {

    let errors: string[] = []

    if (typeof req.body.name != 'string') {
        errors.push("Name not found or is not a string")
    }

    if (typeof req.body.email != 'string') {
        errors.push("Email not found or is not a string")
    }

    if (errors.length === 0) {
        const info = addNewApplicationInTable.run(req.body)
        const applicant = getApplicantsById.get({ id: info.lastInsertRowid })
        applicant.interview = getInterviewDoneByApplicants.all({ applicantsId: applicant.id })
        applicant.interviewers = interviewersThatInterviewedApplicants.all({ applicantsId: applicant.id })
        res.send(applicant)

    } else {
        res.status(404).send(errors)
    }
})

app.post('/interviewers', (req, res) => {

    let errors: string[] = []

    if (typeof req.body.name != 'string') {
        errors.push("Name not found or is not a string")
    }

    if (typeof req.body.email != 'string') {
        errors.push("Email not found or is not a string")
    }

    if (errors.length === 0) {
        const info = addNewInterviewersInTable.run(req.body)
        const interviewer = getInterviewersById.get({ id: info.lastInsertRowid })
        interviewer.interview = getInterviewDoneForInterviewers.all({ interviewersId: interviewer.id })
        interviewer.applicant = applicantsInterviewedByInteviewers.all({ interviewersId: interviewer.id })
        res.send(interviewer)

    } else {
        res.status(404).send(errors)
    }
})

app.post('/interviews', (req, res) => {

    let errors: string[] = []

    if (typeof req.body.applicantsId != 'number') {
        errors.push("ApplicantsId is not a number or not found")
    }

    if (typeof req.body.interviewersId != 'number') {
        errors.push("InterviewersId is not a number or not found")
    }

    if (typeof req.body.date != 'string') {
        errors.push("Date is not a string or not found")
    }

    if (typeof req.body.score != 'number') {
        errors.push("Score is not a number or not found")
    }

    if (errors.length === 0) {

        const info = addNewInterviewsInTable.run(req.body)
        const interview = getInterviewById.all({ id: info.lastInsertRowid })
        res.send(interview)
    } else {
        res.status(404).send(errors)
    }
})

app.post('/companies', (req, res) => {

    let errors: string[] = []

    if (typeof req.body.name != 'string') {
        errors.push("Name not found or is not a string")
    }

    if (typeof req.body.city != 'string') {
        errors.push("City not found or is not a string")
    }

    if (errors.length === 0) {
        const info = addNewCompaniesTable.run(req.body)
        const company = getCompaniesById.get({ id: info.lastInsertRowid })
        company.interviewer = interviewersInCompany.all(company.id)
        company.employee = employeesInCompany.all(company.id)
        res.send(company)
    } else {
        res.status(404).send(errors)
    }
})

app.patch('/interviews/:id', (req, res) => {

    const findMatch = getInterviewById.get(req.params)
    if (findMatch) {
        const updatedInterview = { ...findMatch, ...req.body }
        updateInterview.run(updatedInterview)
        res.send(updatedInterview)
    } else {
        res.status(404).send({ error: "Not found" })
    }
})

app.delete('/employee/:id', (req, res) => {

    const info = getEmployesById.get(req.params)
    const fire = fireEmployees.run(info)

    if (fire.changes) {
        res.send({ approved: "Employee fired" })
    } else {
        res.status(404).send({ Notapproved: "Employee not fired" })
    }
})


app.listen(port, () => {
    console.log(`App runs on http://localhost:${port}/`)
})





