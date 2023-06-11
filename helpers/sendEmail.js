const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const {GRID_API_KEY} = process.env;

sgMail.setApiKey(GRID_API_KEY);

const sendEmail = async (data) => {
    const email = {...data, from: "antontsyrkunov@gmail.com"};
    await sgMail.send(email);
    return true;
}

module.exports = sendEmail;