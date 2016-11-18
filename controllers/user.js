var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var randomstring = require("randomstring");
const User=require('../models/User');
exports.profile=(req,res,next) => {
  console.log(req.session);
  res.sendFile(path.join(__dirname,'/../views/profile.html'));
};
exports.loginPage=(req,res,next) => {
  res.sendFile(path.join(__dirname,'/../views/login.html'));
};
exports.forgotPage=(req,res,next) => {
  res.sendFile(path.join(__dirname,'/../views/forgot.html'));
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
exports.signup=(req,res,next) => {
  //check if id exists
  //check if id is of IIIT Vadodara
  var stri=req.body.EMailID;
  if(stri.toString().split("@")[1]!=="iiitvadodara.ac.in")
    res.send("Use IIITV ID")
  else{
    var name = stri.toString().split("@")[0];
    if(typeof name=='number')
      req.session.userType="student"
    else
      req.session.userType="Prof"
    var pass=randomstring.generate(10);
    req.session.cookie.maxAge = 864000000;
    req.session.sessionID=req.sessionID;
    req.session.ID=req.body.EMailID;
    req.session.name=req.body.firstName;
    //var transporter = nodemailer.createTransport('smtps://signup.ctalk%40gmail.com:softengine@smtp.gmail.com');
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
          user: 'signup.ctalk@gmail.com',
          pass: 'softengine'
      },
      tls: { rejectUnauthorized: false }
    }))
    // setup e-mail data with unicode symbols
    var mailOptions = {
      from: '"C-Talk" <signup.ctalk@gmail.com>', // sender address
    };
    mailOptions["to"]=req.body.EMailID;
    mailOptions["subject"]='Welcome to CTalk '+req.body.firstName;
    mailOptions["text"]="Your password is "+pass;
    console.log(mailOptions);
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("Mail not sent"+error);
            res.send("Wrong EMail");
            res.end();
        }
        console.log('Message sent: ' + info.response);
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          EmailID: req.body.EMailID,
          password: pass
        });
        console.log(user);
        user.save((err) => {
          if (err) return next(err);
          res.redirect('/selectTopic');
        });
    });
  }
};
exports.forgotPass=(req,res,next)=>{
  User.find({EmailID:req.body.EMailID},function(err,data){
    if(err) throw err;
    if(data.length==0){
      res.send("email does not exists");
      res.end()
    }
    else{
      var pass=randomstring.generate(10);
      var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'signup.ctalk@gmail.com',
            pass: 'softengine'
        },
        tls: { rejectUnauthorized: false }
      }))
      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: '"C-Talk" <signup.ctalk@gmail.com>', // sender address
      };
      mailOptions["to"]=req.body.EMailID;
      mailOptions["subject"]='Hey, '+data[0].firstName;
      mailOptions["text"]="Your password is "+pass;
      console.log(mailOptions);
      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              console.log("Mail not sent"+error);
              res.send("Wrong EMail");
              res.end();
          }
          console.log('Message sent: ' + info.response);
          User.findOneAndUpdate({EmailID:req.body.EMailID},{password:pass},function(err,data){
            if(err) throw err;
            res.redirect('/login');
          });
      });
    }
  })

}
exports.login=(req,res,next) => {
  User.find({EmailID:req.body.EMailID,password:req.body.password},function(err,data){
    if(err) throw err;
    if(data.length==0){
      res.send("Wrong info");
      res.end();
    }
    else {
      console.log(data);
      req.session.ID=req.body.EMailID;
      req.session.name=data[0].firstName;
      console.log(req.body.EMailID);
      console.log(req.session);
      res.redirect('/');
    }
  });
}
exports.changePass=(req,res,next) => {
  User.findOneAndUpdate ({EmailID:req.session.ID,password:req.body.currentPass},{password:req.body.newPass},function(err,data){
    if(err) throw err;
    console.log("updated");
    res.redirect('/profile');
  })
}
