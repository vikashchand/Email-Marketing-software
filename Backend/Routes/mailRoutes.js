const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const dbCon = require('../config/dbConfig');
const dotenv = require('dotenv');
const MailParser = require('mailparser').MailParser;
const Imap = require('imap');

dotenv.config();

const SMTP_MAIL = process.env.SMTP_MAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const bounceEmailConfig = {
  host: 'imap.gmail.com',
  port: 993,
  user: SMTP_MAIL,
  password: SMTP_PASSWORD,
  tlsOptions: { rejectUnauthorized: false },
  tls: true,
};

const displayAllEmails = (recipientEmail, res) => {
  const imap = new Imap(bounceEmailConfig);

  const openInbox = (cb) => {
    imap.openBox('INBOX', true, cb);
  };

  const fetchAllEmails = (cb) => {
    const f = imap.fetch('1:*', { bodies: '' });
    const allEmails = [];
    let failedRecipientExists = false; // Track if recipient email exists in failed recipients list

    f.on('message', (msg, seqno) => {
      const parser = new MailParser();

      parser.on('headers', (headers) => {
        const parsedEmail = {
          headers: headers,
          body: '',
        };
        allEmails.push(parsedEmail);

        const xFailedRecipients = headers.get('x-failed-recipients');
        if (xFailedRecipients && xFailedRecipients.includes(recipientEmail)) {
          failedRecipientExists = true;
        }
      });

      parser.on('data', (data) => {
        if (data.type === 'text') {
          const lastEmail = allEmails[allEmails.length - 1];
          lastEmail.body += data.text;
        }
      });

      msg.on('body', (stream, info) => {
        stream.pipe(parser);
      });

      msg.once('end', () => {
        // This event indicates the end of fetching the current email
      });
    });

    f.once('error', (error) => {
      console.error('Error fetching emails:', error);
      cb(error, []);
    });

    f.once('end', () => {
      if (failedRecipientExists) {
        console.log('Recipient email does not exist:', recipientEmail);

        // Update the database status for the recipient email
        dbCon.collection('customers').updateOne(
          { customer_email: recipientEmail },
          { $set: { status: 'Email does not exist' } },
          (err, result) => {
            if (err) {
              console.error('Error updating status in the database:', err);
            }
          }
        );

        if (!res.headersSent) {
          res.status(400).json({ error: 'Recipient email does not exist' });
        }
        return;
      }

      cb(null, allEmails);
    });
  };

  const closeConnection = () => {
    imap.end();
  };

  imap.once('ready', () => {
    openInbox((error) => {
      if (error) {
        console.error('Error opening INBOX:', error);
        closeConnection();
        return;
      }

      fetchAllEmails((error, emails) => {
        if (error) {
          console.error('Error fetching emails:', error);
        }

        closeConnection();
      });
    });
  });

  imap.once('error', (error) => {
    console.error('IMAP error:', error);
    closeConnection();
  });

  imap.once('end', () => {
    console.log('IMAP connection ended');
  });

  imap.connect();
};

const sendEmail = async (req, recipientEmail, templateName, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      logger: false,
      debug: true,
      secureConnection: false,
      auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    dbCon.collection('templates').findOne({ type: templateName }, async (error, template) => {
      if (error) {
        console.error(error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error retrieving email template' });
        }
        return;
      }

      if (!template) {
        console.error('Template not found');
        if (!res.headersSent) {
          res.status(404).json({ error: 'Template not found' });
        }
        return;
      }

      const mailOptions = {
        from: SMTP_MAIL,
        to: recipientEmail,
        html: template.body,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!', info.response);
        if (!res.headersSent) {
          res.json({ message: 'Email sent successfully', response: info.response });
        }
      } catch (error) {
        console.error('Error sending email:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error sending email', response: error.response });
        }
        if (error.responseCode === 550) { // Check if recipient email doesn't exist
          if (!res.headersSent) {
            res.status(400).json({ error: 'Recipient email does not exist' });
          }
        }
      }

      transporter.on('idle', () => {
        const failedRecipients = transporter.failedRecipients;
        if (failedRecipients.length > 0) {
          console.log('Failed recipients:', failedRecipients);
        }
        transporter.close();
      });
    });
  } catch (error) {
    console.error('Error sending email:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error sending email' });
    }
  }
};

router.post('/send-email', async (req, res) => {
  const { recipientEmail, templateName } = req.body;

  try {
    await sendEmail(req, recipientEmail, templateName, res);

    // Delay execution of displayAllEmails by 5 seconds
    setTimeout(() => {
      displayAllEmails(recipientEmail, res);
    }, 5000);

    // Other code for updating other functionalities
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error sending email' });
    }
  }
});

module.exports = router;
