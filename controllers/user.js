var path = require('path');
exports.profile=(req,res,next) => {
  res.sendFile(path.join(__dirname,'./views/profile.html'));
};
exports.logout=(req,res,next) => {
  req.session.regenerate(function(e){
    if (e) throw e;
    res.redirect('/');
  });
}
exports.getCookie=(req,res,next) => {
  res.send(req.session);
};
