var path = require("path");

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BDD SQLite
var sequelize = new Sequelize(null, null, null, 
				{dialect: "sqlite", storage: "quiz.sqlite"}
			);

// Importar la definición de la tabla en Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // Exportar definición de tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en BDD
sequelize.sync().success(function(){
	// success(..)  ejecuta el manejador  una vez creada la tabla
	Quiz.count().success(function(count){
		if(count === 0) { // la tabla se inicializa solo si vacía
			Quiz.create({ pregunta: 'Capital de Italia', 
						  respuesta: 'Roma'
						})
			.success(function(){console.log('BDD inicializada')});
		};
	});	
});

