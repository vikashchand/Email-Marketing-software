const nodemailer = require('nodemailer');
const env=require('dotenv').config()
const SMTP_MAIL= process.env.SMTP_MAIL
const SMTP_PASSWORD =process.env.SMTP_PASSWORD

const sendDMail = async (email,mailSubject,content) => {


try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
          user: SMTP_MAIL,
          pass: SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

    const mailOptions = {
        from: SMTP_MAIL,
        to: email,
        subject: mailSubject,
        html: content
    
    }
       // Send the email
       await transporter.sendMail(mailOptions)

       console.log('Email has been sent successfully!');
      } catch (error) {
        console.error('Error sending email:', error);
        throw error;
      }
    };


    // const htmlTemplate = fs.readFileSync('otp.html', 'utf8');
     // Create a nodemailer transporter using your email service configuration
     


module.exports = sendDMail;