const mongoose = require('mongoose');

const mapSchema = mongoose.Schema({
  name:    {type: String, default: ''},
  block:   {type: String, default: ''},
  site:    {type: String, default: ''},
  image:   {type: String, default: ''},
});

mapSchema.index({ name: 1, block: 1, site: 1}, { unique: true });

module.exports = mongoose.model('Map', mapSchema);