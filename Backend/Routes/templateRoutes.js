const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const dbCon = require('../config/dbConfig');
const userServices = require('../Services/userServices');

const templatesPath = path.join(__dirname, 'templates');

const AdminPowersAudit = require('../models/AdminPowersAudit'); // Replace AdminPowersAudit with your appropriate model name

const executeQuery = async (sql, params) => {
  try {
    const data = await AdminPowersAudit.find({});
    return data;
  } catch (error) {
    throw error;
  }
};

const auditLog = async (email, type, templateName) => {
  try {
    const time = new Date();

    const audit = new AdminPowersAudit({
      email: email, // Provide the email value
      type,
      template_name: templateName,
      time,
    });

    await audit.save();
  } catch (error) {
    throw error;
  }
};


// Get the contents of a specific template
router.get('/', async (req, res) => {
  const { template } = req.query;
  const templatePath = path.join(templatesPath, `${template}.html`);
  const email = userServices.getLoggedInUserEmail(); // Replace with your appropriate method to get the user's email
console.log(templatePath);
  try {
    const data = await fs.promises.readFile(templatePath, 'utf8');
    res.json({ template: data });
    await auditLog(email, 'reading', template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read the template file' });
  }
});

// Update the contents of a specific template
router.put('/', async (req, res) => {
  const { template } = req.query;
  const updatedTemplate = req.body.template;
  const templatePath = path.join(templatesPath, `${template}.html`);
  const email = userServices.getLoggedInUserEmail(); // Replace with your appropriate method to get the user's email

  try {
    await fs.promises.writeFile(templatePath, updatedTemplate);
    res.json({ message: 'Template updated successfully' });
    await auditLog(email, 'updating', template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the template file' });
  }
});

// Delete a specific template
router.delete('/', async (req, res) => {
  const { template } = req.query;
  const templatePath = path.join(templatesPath, `${template}.html`);
  const email = userServices.getLoggedInUserEmail(); // Replace with your appropriate method to get the user's email

  try {
    await fs.promises.unlink(templatePath);
    res.json({ message: 'Template deleted successfully' });
    await auditLog(email, 'deleting', template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the template file' });
  }
});

module.exports = router;
