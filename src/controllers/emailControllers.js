const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler')


const sendEmail = asyncHandler(async (data) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Shop Web" <trannhatvy090199@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: "FORGOT PASSWORD", // Subject line
        // text: data.next, // plain text body
        html: data.html, // html body
    });

})

module.exports = sendEmail