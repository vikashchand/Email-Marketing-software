const dbCon = require('../config/dbConfig');
const mongoose = require('mongoose');


const randomstring = require('randomstring');

const sendDMail = require('../helpers/sendDMail');

const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const SECURITYKEY=process.env.SECURITYKEY
const User = require('../models/User');
const Audit = require('../models/Audit');
const Adminpowersaudit = require('../models/AdminPowersAudit');
const Customer = require('../models/Customer');
const PasswordReset = require('../models/passwordReset');

const fs = require('fs');
const currentTime = new Date().toISOString("en-US", { timeZone: "Asia/Kolkata" });

const env=require('dotenv').config()
const SMTP_MAIL= process.env.SMTP_MAIL
const SMTP_PASSWORD =process.env.SMTP_PASSWORD

const nodemailer = require('nodemailer');


const sendWelcomeEmail = async (email) => {
  try {
 // const htmlTemplate = fs.readFileSync('otp.html', 'utf8');
  // Create a nodemailer transporter using your email service configuration
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
  // Prepare the email content
 
  const mailOptions = {
    from: SMTP_MAIL,
    to: email,
    subject: 'You logged in successfully',
    html: `<p>Hi,</p><p>You have successfully logged in to your account.</p><p>Date and Time: ${currentTime}</p>`
  };
   // Send the email
   await transporter.sendMail(mailOptions);
   console.log('login Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

  


  const auditLog = async (actor, type) => {
    const action = (type === 'login') ? 'User login' : 'User signup';
    const time = new Date().toISOString();
  
    try {
      const auditEntry = new Audit({
        actor,
        type,
        action,
        time,
      });
  
      await auditEntry.save();
      console.log('Audit log saved successfully');
    } catch (error) {
      console.error('Error saving audit log:', error);
    }
  };
  
  let loggedInUserEmail = '';
  

  





  const userLogin = async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      // Find the user by email or username
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });
  
      if (!user) {
        return res.json({
          status: 400,
          message: 'User does not exist',
        });
      }
  
      const accountStatus = user.account_status;
  
      if (accountStatus === 'active') {
        const hashedPassword = user.password;
  
        console.log('Entered Password:', password);
        console.log('Hashed Password from DB:', hashedPassword);
        const isAdmin = user.is_admin;
        const query = { is_admin: { $eq: isAdmin } };
        console.log('isAdmin:jjjjj', isAdmin);

        
        const isMatch = await bcrypt.compare(password.trim(), hashedPassword);
  
        if (isMatch) {
          // Fetch additional user data if needed
         
          const data2 = user.toJSON(); // Convert user object to JSON or extract required fields
  
          const auth = jwt.sign({ data: data2 }, SECURITYKEY);
  
          user.last_login = new Date();
          await user.save();
  
          res.json({
            status: 200,
            message: 'Login success',
            token: auth,
            email: data2.email,
          });
  console.log(auth,"token")

          loggedInUserEmail = data2.email;

          console.log(data2.is_admin);

          console.log('Logged in user email:', loggedInUserEmail);
  
          await auditLog(data2.email, 'login');
          await sendWelcomeEmail(data2.email);
        } else {
          res.json({
            status: 400,
            message: 'Password does not match',
          });
        }
      } else {
        res.json({
          status: 400,
          message: 'Account is inactive. Please contact the admin department.',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      res.json({
        message: error.message,
      });
    }
  };
  

  










  const userSignup = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({
          status: 400,
          message: 'User with this email already exists',
        });
      }
  
      // Check if the username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.json({
          status: 400,
          message: 'User with this username already exists',
        });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Send verification mail
      const mailSubject = 'Mail verification';
      const randomToken = randomstring.generate();
      const content = `<p>Hi ${req.body.username},</p><p>Please click on the link to verify your email:</p><a href="https://email-marketing-software.vercel.app/mail-verification?token=${randomToken}">Click here</a>`;
      sendDMail(req.body.email, mailSubject, content);
  
      // Update user token in the database
      await User.updateOne({ email: req.body.email }, { token: randomToken });

          // Log signup action to audit log
    // await auditLog(email, 'signup');

    res.json({
      status: 200,
      message: 'A verification mail has been sent to your email id',
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({
      message: error.message,
    });
  }
  }

  
  

      const getLoggedInUserEmail = () => {
        return loggedInUserEmail;
      };


      const verifyMail = async (req, res) => {
        const token = req.query.token;
      
        try {
          const user = await User.findOne({ token });
      
          if (user) {
            user.token = null;
            user.is_verified = 1;
            await user.save();
      
            return res.render('mail-verification', {
              message: 'Your email has been verified',
              loginLink: 'https://email-marketing-software.vercel.app/login',
            });
          } else {
            return res.render('404');
          }
        } catch (error) {
          console.log(error.message);
          // Handle error and return appropriate response
        }
      };
      



      const usersList = async (req, res) => {
        try {
          const users = await User.find();
          res.json(users);
        } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      


      const customerList = async (req, res) => {
        try {
          const customers = await Customer.find();
          res.json(customers);
        } catch (error) {
          console.error('Error fetching customers:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      



const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    await User.deleteOne({ _id: id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserAccountStatus = async (req, res) => {
  const { id } = req.params;
  const { account_status } = req.body;

  try {
    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    await User.updateOne({ _id: id }, { account_status });
    res.json({ message: 'Account status updated successfully' });
  } catch (error) {
    console.error('Error updating account status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatecustomerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    const customer = await Customer.findOneAndUpdate({ _id: id }, { status }, { new: true });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Account status updated successfully' });
  } catch (error) {
    console.error('Error updating account status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





////////////////////////////////////////////////////////////////////////////////////////////////////


const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (user) {
      const mailSubject = 'Forget Password';
      const randomToken = randomstring.generate();
      const content = `<p>Hi ${user.username}</p><p>Please click on the link to reset your password:</p><a href="https://email-marketing-software.vercel.app/forget-Password?token=${randomToken}">Click here</a>`;
      sendDMail(email, mailSubject, content);

      await PasswordReset.deleteOne({ email });
      await PasswordReset.create({ email, token: randomToken });

      return res.status(200).json({ status: 200, message: 'Reset email has been sent to your email address' });
    }

    return res.status(404).json({ status: 404, message: 'Email not found' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
};

 

const resetPassword = async (req, res) => {
  try {
    const token = req.query.token;
    if (token === undefined) {
      res.render('404');
      return;
    }

    const passwordReset = await PasswordReset.findOne({ token });

    if (passwordReset) {
      const user = await User.findOne({ email: passwordReset.email });

      if (user) {
        res.render('reset-password', { user });
        return;
      }
    }

    res.render('404');
  } catch (error) {
    console.log(error.message);
  }
};

const resetPasswordPost = async (req, res) => {
  try {
    const updatedTime = new Date().toISOString("en-US", { timeZone: "Asia/Kolkata" });
    if (req.body.password !== req.body.confirm_password) {
      res.render('reset-password', { error_message: 'Password does not match', user: { id: req.body.user_id, email: req.body.email } });
      return;
    }

    const user = await User.findById(req.body.user_id);

    if (user) {
      bcrypt.hash(req.body.confirm_password, 10, async (err, hash) => {
        if (err) {
          console.log(err);
          return;
        }

        await PasswordReset.deleteOne({ email: req.body.email });
        user.password = hash;
        user.updated_at = updatedTime;
        await user.save();

        res.render('message', {
          message: 'Your password has been changed successfully',
          loginLink: 'https://email-marketing-software.vercel.app/login'
        });
      });
    } else {
      res.render('404');
    }
  } catch (error) {
    console.log(error.message);
  }
};


// GET request to fetch all templates
const fetchTemp = (req, res) => {
  TemplateModel.find({}, (error, templates) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(templates);
    }
  });
};

// POST request to create a new template
const newTemp = (req, res) => {
  const { body, type } = req.body;
  const email = getLoggedInUserEmail();

  // Insert the audit record
  const audit = new Adminpowersaudit({ email, type, template_name: type });
  audit.save((error, auditResult) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log('Executing SQL Query:', insertQuery, insertValues);

    // Insert the template record
    const template = new TemplateModel({ body, type });
    template.save((error, templateResult) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.sendStatus(201);
    });
  });
};

// PUT request to update a template
const updateTemp = (req, res) => {
  const { body, type } = req.body;
  const email = getLoggedInUserEmail();
  const templateId = req.params.templateId;

  // Insert the audit record
  const audit = new Adminpowersaudit({ email, type: 'updating', template_name: type });
  audit.save((error, auditResult) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(insertQuery, insertValues);

    // Update the template record
    TemplateModel.findByIdAndUpdate(templateId, { body }, (error, updateResult) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.sendStatus(201);
    });
  });
};

// DELETE request to delete a template
const DeleteTemp = (req, res) => {
  const templateId = req.params.id;
  const { type } = req.body;
  const email = getLoggedInUserEmail();

  // Insert the audit record
  const audit = new Adminpowersaudit({ email, type: 'Deleting', template_name: type });
  audit.save((error, auditResult) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(insertQuery, insertValues);

    // Delete the template record
    TemplateModel.findByIdAndDelete(templateId, (error, deleteResult) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      return res.sendStatus(201);
    });
  });
};

// Fetch audit logs
const audit = (req, res) => {
  AuditModel.find({}, (error, auditLogs) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    } else {
      res.json(auditLogs);
    }
  });
};

// Fetch admin powers audit logs
const adminpowersaudit = (req, res) => {
  AuditModel.find({}, (error, adminAuditLogs) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch audit logs' });
    } else {
      res.json(adminAuditLogs);
    }
  });
};

// Fetch customers
const customers = (req, res) => {
  CustomerModel.find({}, (error, customers) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    } else {
      res.json(customers);
    }
  });
};









      module.exports = { userLogin, forgetPassword,resetPasswordPost,resetPassword,
        
        
        userSignup, getLoggedInUserEmail ,verifyMail,deleteUser,usersList,customerList,updateUserAccountStatus,updatecustomerStatus
        ,fetchTemp,newTemp,updateTemp,DeleteTemp,audit,adminpowersaudit,customers
      
      };