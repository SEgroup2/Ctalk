const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName:String,
  lastName:String,
  EmailID:String,
  password:String,
  userType:String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
