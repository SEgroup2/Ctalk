var path = require('path');

const Question=require('../models/Questions');

exports.index=(req,res,next) => {
  res.sendFile(path.join(__dirname,'/../views/index.html'));
};
exports.questions=(req,res,next) => {
  res.sendFile(path.join(__dirname,'/../views/questions.html'));
};
exports.addQuestion=(req,res,next) => {
  res.sendFile(path.join(__dirname,'/../views/addQuestion.html'));
};
exports.questionPage=(req,res,next) => {
  res.sendFile(path.join(__dirname,'/../views/question.html'));
}
exports.add=(req,res,next) => {
  console.log(req.body);
  const quest = new Question({
    question: req.body.question,
    detail:req.body.detail,
    tag:req.body.tag
  });
  quest.save((err,q) => {
     if (err) { return next(err); }
     console.log(q._id);
     res.redirect('/question?qID='+q._id);
   });
}
exports.questionsList=(req,res,next) => {
  Question.find({},(err,data) =>{
    if(err) return next(err);
    res.send(data);
  })
}
exports.questionDetail=(req,res,next) => {
  Question.findOne({_id:req.params.qID},(err,data) =>{
    if(err) return next(err);
    res.send(data);
  });
}
