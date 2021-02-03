const mongoose = require('mongoose');

const subgatewaySchema = mongoose.Schema({
  dev_id:        {type: String, unique: true},
  parent_mg:     {type: String, default: ''},
  connection:    {type: String, default: ''},
  lastupdate:    {type: String, default: ''},
  dead_count:    {type: Number, default: 0},
  ep_list:       {type: String, default: ''},
  opt_path:      {type: String, default: ''},
  listen_to:     {type: String, default: ''},
  rssi:          {type: String, default: ''},
  coordinator:   {type: Boolean,default: false},
  frequency:     {type: String, default: ''},
  repeat_sg_num: {type: Number, default: 0},
  repeat_ep_num: {type: Number, default: 0},

  floor:      {type: String, default: ''},
  xy:         {type: String, default: ''},
});

module.exports = mongoose.model('Subgateway', subgatewaySchema);