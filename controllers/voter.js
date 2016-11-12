const Voter=require('../models/Voter');
//toggle upvote for (user,answer)
exports.upvote=(req,res,next) => {
  Voter.count({
    UserEMailID:req.session.ID,
    AnswerID:req.params.ansID
  },function(err,count){
    console.log(count);
      if(count==0){
        const vote=new Voter({
          UserEMailID:req.session.ID,
          AnswerID:req.params.ansID
        });
        vote.save((err) =>{
          if(err) return err;
          res.end();
        });
      }
      else{
        Voter.remove({
          UserEMailID:req.session.ID,
          AnswerID:req.params.ansID
        },function(err){
          res.end();
        });
      }
    });
};
exports.getUpvotesNo=(req,res,next) => {
  Voter.count({AnswerID:req.params.ansID},function(err,count){
    if(err) throw err;
    var a={"count":count};
    res.send(a);
  })
};
