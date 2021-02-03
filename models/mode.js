const mongoose = require('mongoose');

const modeSchema = mongoose.Schema({
  mode:     {type: String, default: ''},
  sessions: {type: String, default: ''},
  site:     {type: String, default: ''},
});

modeSchema.index({ mode: 1, site: 1}, { unique: true });

module.exports = mongoose.model('Mode', modeSchema);