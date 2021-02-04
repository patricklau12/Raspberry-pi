const mongoose = require('mongoose');

//UI, physical condition & 
const endpointSchema = mongoose.Schema({
  dev_id:     {type: String, unique: true},     // another schema, with unique = time stamp, to save data
  parent_mg:  {type: String, default: ''},    
  parent_sg:  {type: String, default: ''},
  data:      {type: String, default: ''},       //data driver 3 bytes, 
  sensor_type:   {type: String, default: ''},   //sensor type


  UI_visibility:   {type: Boolean, default: true}, //show the sensor or not
  name:          {type: String, default: ''},
  toilet_type:   {type: String, enum: ['Male', 'Female', 'Access', 'Nurse']},  //toilet type
  location:      {type: String, default: ''},  //which room

  //watt:       {type: String, default: ''}, 



  // func_id:    {type: String, default: ''},
  // func_res:   {type: String, default: ''},
  // func_date:  {type: String, default: ''},  

  // dura_id:    {type: String, default: ''},
  // dura_res:   {type: String, default: ''},
  // dura_date:  {type: String, default: ''},

  // prod_id:    {type: String, default: ''},
  // prod_res:   {type: String, default: ''},
  // prod_date:  {type: String, default: ''},

  //on & offline
  connection: {type: String, default: ''},  
  lastupdate: {type: String, default: ''},
  wakeup_int: {type: String, default: ''}, //wake up interval
  dead_count: {type: Number, default: 0 },  //e.g.  dead_count = 3 -> offline

  
  // mode_a:     {type: String, default: ''},
  // mode_b:     {type: String, default: ''},
  // mode_c:     {type: String, default: ''},
  // mode_d:     {type: String, default: ''},
  // mode_e:     {type: String, default: ''},
  // mode_f:     {type: String, default: ''},

  //floor:      {type: String, default: ''},
  //xy:         {type: String, default: ''},
});

module.exports = mongoose.model('Endpoint', endpointSchema);