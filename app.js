const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config();
const sgMail = require("@sendgrid/mail");

const authRouter = require('./routes/api/auth')
const contactsRouter = require('./routes/api/contacts')
const {GRID_API_KEY} = process.env;
sgMail.setApiKey(GRID_API_KEY);

const email = {
  to: 'kewip58671@rockdian.com',
  from: "antontsyrkunov@gmail.com",
  subject: 'Test',
  html: '<div><p>Test</p></div>'
}

sgMail.send(email)
  .then(()=> console.log("Sucsess"))
  .catch((error) => console.log(error.message));

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors());
app.use(express.json());
app.use(express.static("public"))

app.use('/users', authRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message })
})

module.exports = app
