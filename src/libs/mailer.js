const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "94b53e91fcd7a2",
    pass: "fdb9964de73706"
  }
})