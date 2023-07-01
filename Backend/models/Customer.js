const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  
  customer_email: {
    type: String,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  template_name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  uploadedby: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});


const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
