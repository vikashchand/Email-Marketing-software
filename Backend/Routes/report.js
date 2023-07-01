const express = require('express');
const router = express.Router();

const fs = require('fs');
const dbCon = require('../config/dbConfig');
const userServices = require('../Services/userServices');

// Endpoint to generate the customer report
router.get('/generateReport', async (req, res) => {
    const { startDate, endDate } = req.query;
  
    try {
      
      const query = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
  
      const customers = await dbCon.collection('customers').find(query).toArray();
  
      const csvFields = ['customer_email', 'customer_name', 'template_name', 'status', 'uploadedby', 'date'];
      const csvData = json2csv.parse(customers, { fields: csvFields });
      const fileName = 'customer_report.csv';
  
      fs.writeFileSync(fileName, csvData);
  
      res.download(fileName, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
  
        fs.unlinkSync(fileName); // Delete the file after download
      });
  
      client.close();
    } catch (error) {
      console.error('Error generating customer report:', error);
      res.status(500).json({ error: 'Failed to generate customer report' });
    }
  });
  
  module.exports = router;