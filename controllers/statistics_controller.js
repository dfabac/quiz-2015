var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res) {

	models.Quiz.findAll({
			include: [{ model: models.Comment }]
		})
	.then(function(quizes) {
		
		var vctot = 0, vcmed = 0, vqcon = 0;
		var vqtot = quizes.length;

		for (var i = 0; i < vqtot; i++) {
				var 	len = quizes[i].Comments.length;
				vqcon += (len > 0);
				vctot += len;
		};

		res.render('statistics/show', {
			qtot: vqtot,
			ctot: vctot,
			cmed: (vctot / vqtot).toFixed(2),
			qsin: (vqtot - vqcon),
			qcon: vqcon,
			errors: [] }
		);
	}).catch(function(error) { next(error); });
};