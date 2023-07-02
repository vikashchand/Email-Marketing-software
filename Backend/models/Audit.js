const mongoose = require('mongoose');

const AuditSchema = new  mongoose.Schema({
  actor: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  time: {
    type: Date
    
  },
});
;

const Audit = mongoose.models.Audit || mongoose.model('Audit', AuditSchema);
module.exports = Audit;
