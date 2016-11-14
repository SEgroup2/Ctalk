const Topic=require('../models/Topic');
var path = require('path');
exports.selectTopic=(req,res,next) => {
  console.log(req.session);
  res.sendFile(path.join(__dirname,'/../views/selectTopics.html'));
};
exports.getTopics=(req,res,next) => {
  Topic.find({},function(err,data){
    if(err) throw err;
    console.log(data);
    res.send(data);
  });
}
