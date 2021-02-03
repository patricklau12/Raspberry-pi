const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  userid:   {type: String,   unique: true, minlength: 4, maxlength: 24},
  username: {type: String,   unique: true},
  password: {type: String,   minlength: 8, maxlength: 32},
  type:     {type: String,   enum: ['super', 'admin', 'user', 'client']},
  site:     {type: String,   default: ''},
  bic:      {type: [String], default: undefined}
});

module.exports = mongoose.model('User', UserSchema);