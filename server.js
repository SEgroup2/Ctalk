//Module Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var twitterAPI = require('node-twitter-api');

//Controllers
var questionController=require('./controllers/question');
var answerController=require('./controllers/answer');
var userController=require('./controllers/user');

//Create Express server
var app = express();
//Connect to MongoDB
const MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
//var url= 'mongodb://localhost:27017/qa';
var url= "mongodb://shikhar97:passDBword@ds063946.mlab.com:63946/qa";           //MLab URL when deploying
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("connected");
});

//Express Configuration
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store:new MongoStore({mongooseConnection:db}),
    resave: true,
    saveUninitialized: true
}));


//SIGN IN WITH TWITTER
var twitter;
app.get('/login',function(req,res,next){
	twitter = new twitterAPI({
	    consumerKey: 'J5uwAAsAVCL5qXypuD2JvEZpH',
	    consumerSecret: 'D9pID6kpYZ31J9hcbWWx8d1B4aBHAwhjjlrzeSEdGrK3k20hue',
	    callback: req.protocol + '://' + req.get('host') + '/callback'
	});
	twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
	    if (error) {
	        console.log("Error getting OAuth request token : " + error);
	    }
	    else {
	    	requestTokeng=requestToken;
	    	requestTokenSecretg=requestTokenSecret;
	    	res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+requestToken);
	    }
	});
});
app.get('/callback',function(req,res,next){
	oauth_verifierg=req.query.oauth_verifier;
	twitter.getAccessToken(requestTokeng, requestTokenSecretg, oauth_verifierg, function(error, accessToken, accessTokenSecret, results) {
	    if (error) console.log(error);
	    else {
	    	accessTokeng=accessToken;
	    	accessTokenSecretg=accessTokenSecret;
	    }
		twitter.verifyCredentials(accessTokeng,accessTokenSecretg,function(error,data,response){
			var time = 864000000;
			req.session.cookie.maxAge = time;
			req.session.sessionID=req.sessionID;
			req.session.twitterID=data.id;
			req.session.name=data.name;
			res.redirect('/');
		});
	});
})

//Routes
//app.get('/login',userController.login);

app.get('/getCookie',userController.getCookie);
app.get('/profile',userController.profile);
app.get('/logout',userController.logout);

app.get('/index',questionController.index);
app.get('/questions',questionController.questions);
app.get('/addQuestion',questionController.addQuestion);
app.get('/question?:qID',questionController.questionPage);

app.get('/api/feed',answerController.feed);
app.get('/api/answers/:qID',answerController.answers);
app.get('/api/questionDetail/:qID',questionController.questionDetail);
app.get('/api/questionsList',questionController.questionsList);
app.post('/api/postQuestion',questionController.add);
app.post('/api/postAnswer',answerController.postAnswer);

app.get('/*',questionController.index);

var server = app.listen(app.get('port'), function () {
	var host = 'localhost'
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
});
