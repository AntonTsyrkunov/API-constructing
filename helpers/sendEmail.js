const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const {GRID_API_KEY} = process.env;

sgMail.setApiKey(GRID_API_KEY);

const sendEmail = async (data) => {
    const email = {...data, from: "antontsyrkunov@gmail.com"};
    await sgMail.send(email);
    return true;
}

// const email = {
//   to: 'kewip58671@rockdian.com',
//   from: "antontsyrkunov@gmail.com",
//   subject: 'Test',
//   html: '<div><p>Test</p></div>'
// }
// sgMail.send(email)
//   .then(()=> console.log("Sucsess"))
//   .catch((error) => console.log(error.message));
module.exports = sendEmail;