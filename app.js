
/**
 * Module dependencies.
 */

var express = require('express');

var conf = require('./conf');

var everyauth = require('everyauth')
	, Promise = everyauth.Promise;
	
everyauth.debug = true;

var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = mongoose.SchemaTypes.ObjectId;
	
var UserSchema = new Schema({})
	, User;
	
var mongooseAuth = require('mongoose-auth');

var dburl = process.env['MONGOLAB_URI'] != null ? process.env['MONGOLAB_URI'] : 'mongodb://localhost:27017/myauth';
var dbconfig = require('./dbconfig.js').dbconfig(dburl);

UserSchema.plugin(mongooseAuth, {
	everymodule: {
		everyauth: {
			User: function(){
				return User;
			}
		}
	},
	facebook: {
		everyauth: {
			myHostname: dbconfig.hostname,
			appId: conf.fb.appId,
			appSecret: conf.fb.appSecret,
			redirectPath: '/'
		}
	},
	twitter: {
		everyauth: {
			myHostname: dbconfig.hostname,
			consumerKey: conf.twit.consumerKey,
			consumerSecret: conf.twit.consumerSecret,
			redirectPath: '/'
		}
	},
	password: {
	        loginWith: 'email'
	      , extraParams: {
	            phone: String
	          , name: {
	                first: String
	              , last: String
	            }
	        }
	      , everyauth: {
	            getLoginPath: '/'
	          , postLoginPath: '/login'
	          , loginView: 'home.jade'
	          , getRegisterPath: '/'
	          , postRegisterPath: '/register'
	          , registerView: 'home.jade'
	          , loginSuccessRedirect: '/'
	          , registerSuccessRedirect: '/'
	        }
	    }
});

mongoose.model('User', UserSchema);

mongoose.connect(dburl);

User = mongoose.model('User');


var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'myauthappsecretkey'}));
  app.use(mongooseAuth.middleware());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res){
	res.render('home');
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

mongooseAuth.helpExpress(app);

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
