const { text } = require('body-parser');
const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  

type: {
    type: String,
    required: true,
  },
 body: {
    type: String,
    required: true,
  },
});


const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);

module.exports = Template;
