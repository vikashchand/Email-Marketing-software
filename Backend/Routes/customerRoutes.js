const express = require('express');
const XLSX = require('xlsx');
const router = express.Router();
const Customer = require('../models/Customer');

router.post('/upload', async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const workbook = XLSX.read(file.buffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const emailColumnIndex = 0;
  const customerNameColumnIndex = 1;
  const templateIdColumnIndex = 2;
  const statusColumnIndex = 3;

  const dataWithoutHeadings = data.slice(1);

  const customers = dataWithoutHeadings.map(row => ({
    customer_email: row[emailColumnIndex],
    customer_name: row[customerNameColumnIndex],
    template_id: row[templateIdColumnIndex],
    status: row[statusColumnIndex]
  }));

  try {
    await Customer.insertMany(customers);
    console.log('Data imported successfully.');
    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
