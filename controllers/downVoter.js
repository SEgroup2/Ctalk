const DownVoter=require('../models/DownVoter');
//toggle upvote for (user,answer)
exports.downvote=(req,res,next) => {
  DownVoter.count({
    UserEMailID:req.session.ID,
    AnswerID:req.params.ansID
  },function(err,count){
    console.log(count);
      if(count==0){
        const vote=new DownVoter({
          UserEMailID:req.session.ID,
          AnswerID:req.params.ansID
        });
        vote.save((err) =>{
          if(err) return err;
          res.end();
        });
      }
      else{
        DownVoter.remove({
          UserEMailID:req.session.ID,
          AnswerID:req.params.ansID
        },function(err){
          res.end();
        });
      }
    });
};
exports.getDownvotesNo=(req,res,next) => {
  DownVoter.count({AnswerID:req.params.ansID},function(err,count){
    if(err) throw err;
    var a={"count":count};
    res.send(a);
  })
};
