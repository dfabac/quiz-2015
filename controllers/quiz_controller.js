var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
				where: { id: Number(quizId) },
				include: [{ model: models.Comment }]
			}
		).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId)); }
		}
	).catch(function(error){ next(error); });
};


// GET /quizes
exports.index = function(req, res) {
	var needle = {};
	if (req.query.search) {
		var auxstr = '%' + req.query.search.toLowerCase().replace(/\ /g, '%') + '%';
		needle = { where: ["lower(pregunta) like ?", auxstr ]};
	}

	models.Quiz.findAll(needle).then(
		function(quizes) {
			res.render('quizes/index', { quizes: quizes, search: req.query.search, errors: [] });
		}
	).catch(function(error) { next.error(error); })
};


// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta: "", respuesta: "", tema: "otro"}	
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz
				// guarda en BDD los campos pregunta y respuesta
				.save({fields: ["pregunta", "respuesta", "tema"]})
				// redirección HTTP a lista de preguntas
				.then(function() { res.redirect('/quizes'); })
			}
		}
	);
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz

	res.render('quizes/edit', { quiz: quiz, errors: [] });
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
	.validate()
	.then(
		function(err) {
			if(err) {
				res.render('quizes/edit', { quiz: req.q, errors: err.errors });
			} else {
				req.quiz
				.save( { fields: ["pregunta", "respuesta", "tema"] })
				.then( function(){ res.redirect('/quizes'); });
			}
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error) {next(error);});
};

// GET /author
exports.author = function(req, res) {
	res.render('author', 
		{nombre: 'Daniel Faba', rutafoto: 'images/londoncalling.png', errors: []});
};