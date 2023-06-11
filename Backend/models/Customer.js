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
  template_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});


const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
