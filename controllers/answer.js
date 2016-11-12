var path = require('path');

const Answer=require('../models/Answers');

exports.postAnswer=(req,res,next) => {
  const ans = new Answer({
    questionID: req.body.questionID,
    answer: req.body.answer,
    userID: req.body.ID
  });
  ans.save((err) => {
     if (err) return err;
     res.end();
   });
}
exports.feed=(req,res,next) => {
  Answer.find({},(err,data) =>{
    if(err) return next(err);
    res.send(data);
  })
}
exports.answers=(req,res,next) => {
  Answer.find({questionID:req.params.qID},(err,data) =>{
    if(err) return next(err);
    res.send(data);
  })
}
