const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  UserEMailID:String,
  AnswerID:String
});
const Voter = mongoose.model('Voter', VoterSchema);
module.exports = Voter;
