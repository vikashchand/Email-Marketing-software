const mongoose = require("mongoose");

const AdminPowersAuditSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  template_name: {
    type: String,
    required: true,
  },
  time: {
    type: Date
   
  },
  
});

const AdminPowersAudit = mongoose.models.AdminPowersAudit || mongoose.model("AdminPowersAudit", AdminPowersAuditSchema);

module.exports = AdminPowersAudit;
