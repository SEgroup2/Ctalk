const mongoose = require('mongoose');

const DownVoterSchema = new mongoose.Schema({
  UserEMailID:String,
  AnswerID:String
});
const DownVoter = mongoose.model('DownVoter', DownVoterSchema);
module.exports = DownVoter;
