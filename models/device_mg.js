const mongoose = require('mongoose');

const maingatewaySchema = mongoose.Schema({
  dev_id:     {type: String, unique: true},
  name:       {type: String, default: ''},
  site:       {type: String, default: ''},

  connection: {type: String, default: ''},
  lastupdate: {type: String, default: ''},
  dead_count: {type: Number, default: 0 },

  rssi:       {type: String, default: ''},
  mac:        {type: String, default: ''},
  socket_id:  {type: String, default: ''},

  floor:      {type: String, default: ''},
  xy:         {type: String, default: ''},
});

maingatewaySchema.index({ dev_id: 1, name: 1, site: 1}, { unique: true });

module.exports = mongoose.model('Maingateway', maingatewaySchema);