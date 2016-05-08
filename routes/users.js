var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var fs = require('fs');

/* GET users listing. */
router.get('/register', function(req, res, next) {
	res.render('register', {
		'title': 'Register'
	});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		'title': 'Login'
	});
});

router.post('/register', function(req, res, next) {
	var name = req.body.name;
	var privilege = req.body.privilege;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var profileImageName = 'noimage.png';
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('privilege', 'Privilege field is required').notEmpty();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Password do not match').equals(req.body.password);
	req.checkBody('password2', 'Password Confirm field is required').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.render('register', {
			errors: errors,
			name: name,
			privilege: privilege,
			username: username,
			password: password,
			password2: password2
		});
	} else {
		var newUser = new User({
			name: name,
			privilege: privilege,
			username: username,
			password: password,
			profileimage: profileImageName
		});
		User.createUser(newUser, function(err, user) {
			if (err) throw err;
			console.log(user);
		});
		req.flash('success', 'You are now registered and may log in');
		res.location('/');
		res.redirect('/');
	}
});

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) throw err;
			if (!user) {
				console.log('Unknown User');
				return done(null, false, {
					message: 'Unknown User'
				});
			}
			User.comparePassword(password, user.password, function(err, isMatch) {
				console.log(password + user.password + isMatch);

				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					console.log('Invalid Password');
					return done(null, false, {
						message: 'Invalid Password'
					});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/users/login',
	failureFlash: 'Invalid username or password'
}), function(req, res) {
	console.log('Authentication Successful');
	req.flash('success', 'You are login');
	res.redirect('/');
});

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You have logged out');
	res.redirect('/users/login');
});


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	};
	res.redirect('/users/login');
}
module.exports = router;