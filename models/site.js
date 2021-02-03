const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({
  site:       {type: String, unique: true},
  start_date: {type: String, default: ''},
  status:     {type: String, enum:['Enabled', 'Suspended', 'Disabled'], default: 'Enabled'},
  manager:    {type: String, default: ''},
  contact:    {type: String, default: ''},
  email:      {type: String, default: ''},
  address:    {type: String, default: ''},
  avatar:     {type: String, default: ''},
  code:       {type: String, unique: true},
});

module.exports = mongoose.model('Site', siteSchema);
