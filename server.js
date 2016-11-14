//Module Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var twitterAPI = require('node-twitter-api');

//Controllers
var questionController=require('./controllers/question');
var answerController=require('./controllers/answer');
var userController=require('./controllers/user');
var voterController=require('./controllers/voter');
var downVoterController=require('./controllers/downVoter');
var topicController=require('./controllers/topic');
var userTopicController=require('./controllers/userTopic');

//Create Express server
var app = express();
//Connect to MongoDB
const MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var url= 'mongodb://localhost:27017/qa';
//var url= "mongodb://shikhar97:passDBword@ds063946.mlab.com:63946/qa";           //MLab URL when deploying
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("connected");
});

//Express Configuration
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

//Routes
app.get('/login',userController.loginPage)
app.get('/getCookie',userController.getCookie);
app.get('/profile',userController.profile);
app.get('/logout',userController.logout);
app.get('/selectTopic',topicController.selectTopic);

app.get('/index',questionController.index);
app.get('/questions',questionController.questions);
app.get('/addQuestion',questionController.addQuestion);
app.get('/question?:qID',questionController.questionPage);


app.post('/api/login',userController.login);
app.post('/api/signup',userController.signup);
app.post('/api/forgotPass',userController.forgotPass);
app.post('/api/changePass',userController.changePass);

app.get('/api/getTopics',topicController.getTopics);
app.post('/api/postTopics',userTopicController.postTopics);
//app.get('/api/topicsList',topicController.topicsList);
//app.post('/api/userTopics',userTopicController.getUserTopics);

app.get('/api/feed',answerController.feed);
app.get('/api/answers/:qID',answerController.answers);

app.get('/api/upvote/:ansID',voterController.upvote);
app.get('/api/getUpvotesNo/:ansID',voterController.getUpvotesNo);

app.get('/api/downvote/:ansID',downVoterController.downvote);
app.get('/api/getDownvotesNo/:ansID',downVoterController.getDownvotesNo);

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
