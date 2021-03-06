var path = require("path");

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url       = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name   = (url[6] || null);
var user      = (url[2] || null);
var pwd       = (url[3] || null);
var protocol  = (url[1] || null);
var dialect   = (url[1] || null);
var port      = (url[5] || null);
var host      = (url[4] || null);
var storage   = process.env.DATABASE_STORAGE;

// Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd, 
		{ dialect:  protocol,
		  protocol: protocol,
		  port:     port,
		  host:     host,
		  storage:  "quiz.sqlite", // solo SQLite
		  omitNull: true           // solo Postgres
		}
);

// Importar la definición de la tabla en Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Comment
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Definición de relación 1-N
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // Exportar definición de tabla Quiz
exports.Comment = Comment; // Exportar definición de tabla Comment

// sequelize.sync() crea e inicializa tabla de preguntas en BDD
sequelize.sync().then(function(){
	// success(..)  ejecuta el manejador  una vez creada la tabla
	Quiz.count().then(function(count){
		if(count === 0) { // la tabla se inicializa solo si vacía
			Quiz.create({ pregunta: 'Capital de Italia', 
						  respuesta: 'Roma',
						  tema: 'otro'
						})
			.then(function(){console.log('BDD inicializada')});
		};
	});	
});
