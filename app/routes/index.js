'use strict';
var path = process.cwd();
var ClickHandler = require('../controllers/clickHandler.server.js');
var BarHandler = require('../controllers/barHandler.server.js');
module.exports = function(app, passport, request) {
	let token = '';

	function getToken() {
		request.post({
			url: 'https://api.yelp.com/oauth2/token',
			form: {
				grant_type: 'client_credentials',
				client_id: process.env.YELP_CLIENT,
				client_secret: process.env.YELP_SECRET
			}
		}, function(err, res, body) {
			if (!err) {
				body = JSON.parse(body);
				token = body.access_token;
			}
		});
	}

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		else {
			res.redirect('/login');
		}
	}
	
	getToken();

	var clickHandler = new ClickHandler();
	var barHandler = new BarHandler();

	app.route('/')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/searchnear').post(function(req, res) {
		request(`https://api.yelp.com/v3/businesses/search?latitude=${req.body.latitude}&longitude=${req.body.longitude}`, {
			'auth': {
				'bearer': token
			}
		}, function(err, response, body){
			if(!err){
				res.send({body: body, user: req.user});
			}
		});
	});

	app.route('/login')
		.get(function(req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function(req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function(req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/bar')
		.get(isLoggedIn, barHandler.getBars)
		.post(isLoggedIn, barHandler.switchBar);	
	
};
