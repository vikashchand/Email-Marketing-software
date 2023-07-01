const mongoose = require("mongoose");

const AdminPowersAuditSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
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
    type: Date,
    required: true,
  },
  email:{
    type: String,
    required: true,
  }
});

const AdminPowersAudit = mongoose.models.AdminPowersAudit || mongoose.model("AdminPowersAudit", AdminPowersAuditSchema);

module.exports = AdminPowersAudit;
