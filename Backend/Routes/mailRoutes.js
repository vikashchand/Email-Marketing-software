const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const env=require('dotenv').config()
const SMTP_MAIL= process.env.SMTP_MAIL
const SMTP_PASSWORD =process.env.SMTP_PASSWORD

// Read the email template based on the template name
const getEmailTemplate = (templateName) => {
  const templatesDir = path.join(__dirname, 'templates');
  const templatePath = path.join(templatesDir, `${templateName}.html`);
  console.log('Template path:', templatePath);
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    return templateContent;
  } catch (error) {
    console.error('Error reading template file:', error);
    throw error;
  }
};

// Send email using nodemailer
const sendEmail = async (recipientEmail, templateName) => {
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
      to: recipientEmail,
      subject: 'Welcome to Your Web App',
      html: getEmailTemplate(templateName), // Use the template based on template name
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Route to send email
router.post('/send-email', async (req, res) => {
  const { recipientEmail, templateName } = req.body;
  try {
    await sendEmail(recipientEmail, templateName);
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending email' });
  }
});

module.exports = router;
