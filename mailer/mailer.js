const nodemailer = require('nodemailer')

const mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'sophia.pacocha98@ethereal.email',
        pass: 'KH2fewD1f6uUM3kw7E',
    }
}

module.exports = nodemailer.createTransport(mailConfig)