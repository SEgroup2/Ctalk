const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionID: String,
  answer:String,
  userID:String
});

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;
