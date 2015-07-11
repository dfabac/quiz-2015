var models = require('../models/models.js');


// MW de autorización
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

exports.sessionTimeout = function(req, res, next) {
	if (req.session.user) {
		if (req.session.tstamp && (Date.now() > req.session.tstamp + 5000) ) {
			delete req.session.user;
			delete req.session.tstamp;
			res.render('sessions/new', {errors: [{"message": "tu sesión caducó"}]});
		} else {
			req.session.tstamp = Date.now();
			console.log(req.session.tstamp);
			next();
		}
	} else {
		next();
	} 
    
};

// GET /login
exports.new = function(req, res) {
	var errors = req.session.errors || {}; 
	req.session.errors = {};
	res.render('sessions/new', {errors: errors});
};


// POST /login
exports.create = function(req, res) {
	var login	 = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){

		if (error) {
			req.session.errors = [{"message": "Se ha producido un error: " + error}];
			res.redirect('/login');
			return;
		}

		// Crear la req.session.user y guardar campos id y username
		//  La sesión se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username: user.username};
		res.redirect(req.session.redir.toString());
	});
};


// DELETE /logout
exports.destroy = function(req, res) {
	delete req.session.user;
	delete req.session.tstamp;
	console.log('ME DESLOGO')
	res.redirect(req.session.redir.toString());
};
