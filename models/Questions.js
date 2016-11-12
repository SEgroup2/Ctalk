const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  detail: String,
  tag: String
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
