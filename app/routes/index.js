'use strict';
var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

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

	var clickHandler = new ClickHandler();
	getToken();

	app.route('/')
		.get(isLoggedIn, function(req, res) {

			res.sendFile(path + '/public/index.html');
		});

	app.route('/autocomplete').get(function(req, res) {
		request('https://api.yelp.com/v3/autocomplete?text=del&latitude=37.786882&longitude=-122.399972', {
				'auth': {
					'bearer': token
				}
			},
			function(err, response, body) {
				res.end(body);
			});
	});

	app.route('/searchnear').post(function(req, res) {
		request(`https://api.yelp.com/v3/businesses/search?latitude=${req.body.latitude}&longitude=${req.body.longitude}`, {
			'auth': {
				'bearer': token
			}
		}, function(err, response, body){
			if(!err){
				res.end(body);
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

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
