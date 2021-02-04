const mongoose = require('mongoose');

const endpointSchema = mongoose.Schema({
  dev_id:     {type: String, unique: true},
  parent_mg:  {type: String, default: ''},
  parent_sg:  {type: String, default: ''},
  light:      {type: String, default: ''},
  name:       {type: String, default: ''},
  type:       {type: String, default: ''},
  group:      {type: String, default: ''},
  watt:       {type: String, default: ''},

  func_id:    {type: String, default: ''},
  func_res:   {type: String, default: ''},
  func_date:  {type: String, default: ''},  

  dura_id:    {type: String, default: ''},
  dura_res:   {type: String, default: ''},
  dura_date:  {type: String, default: ''},

  prod_id:    {type: String, default: ''},
  prod_res:   {type: String, default: ''},
  prod_date:  {type: String, default: ''},

  connection: {type: String, default: ''},
  lastupdate: {type: String, default: ''},
  dead_count: {type: Number, default: 0 },

  mode_a:     {type: String, default: ''},
  mode_b:     {type: String, default: ''},
  mode_c:     {type: String, default: ''},
  mode_d:     {type: String, default: ''},
  mode_e:     {type: String, default: ''},
  mode_f:     {type: String, default: ''},

  floor:      {type: String, default: ''},
  xy:         {type: String, default: ''},
});

module.exports = mongoose.model('Endpoint', endpointSchema);