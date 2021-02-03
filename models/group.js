const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  name:       {type: String, default: ''},
  block:      {type: String, default: ''},
  site:       {type: String, default: ''},

  func_date:  {type: String, default: ''},
  func_hh:    {type: String, default: ''},
  func_mm:    {type: String, default: ''},

  dura_month: {type: String, default: ''},
  dura_date:  {type: String, default: ''},
  dura_hh:    {type: String, default: ''},
  dura_mm:    {type: String, default: ''},

  mode_a:     {type: String, default: ''},
  mode_b:     {type: String, default: ''},
  mode_c:     {type: String, default: ''},
  mode_d:     {type: String, default: ''},
  mode_e:     {type: String, default: ''},
  mode_f:     {type: String, default: ''},
});

groupSchema.index({ name: 1, block: 1}, { unique: true });

module.exports = mongoose.model('Group', groupSchema);