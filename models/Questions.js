const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;
