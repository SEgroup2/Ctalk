const UserTopic=require('../models/UserTopic');
exports.getUserTopics=(req,res,next) => {
  console.log(req.body);
};
exports.postTopics=(req,res,next) => {
  console.log(req.body.topic);
  var json={"UserEMailID":req.session.ID};
  var t={};
  for(var i in req.body.topic){
    t[i.toString()]=req.body.topic[i.toString()];
  }
  json["topic"]=t;
  console.log(json);
  var n=new UserTopic(json);
  n.save(function(err){
    if(err) throw err;req.session.regenerate(function(e){
      if (e) throw e;
      res.redirect('/login#login'); 
    });
  })
}
