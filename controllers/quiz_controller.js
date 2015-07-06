var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
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
		var auxstr = '%' + req.query.search.replace(/\ /g, '%') + '%';
		needle = { where: ["pregunta like ?", auxstr ]};
	}

	models.Quiz.findAll(needle).then(
		function(quizes) {
			res.render('quizes/index', { quizes: quizes, search: req.query.search });
		}
	).catch(function(error) { next.error(); })
};


// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}	
	);
	res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	// guarda en BDD los campos pregunta y respuesta
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
		res.redirect('/quizes');
	}); // redirección HTTP a lista de preguntas
};

// GET /author
exports.author = function(req, res) {
	res.render('author', 
		{nombre: 'Daniel Faba', rutafoto: 'images/londoncalling.png'});
};