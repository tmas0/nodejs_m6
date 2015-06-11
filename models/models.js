var path = require('path')

// PostgreSQL DATABASE_URL = postgres://user@passwd@host:port/database
// SQLite     DATABASE_URL = sqlite = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar el modelo ORM.
var Sequelize = require('sequelize');

// Usar BD SQLite.
var sequelize = new Sequelize(DB_name, user, pwd,
                        {dialect: dialect,
                         protocol: protocol,
                         port: port,
                         host: host,
                         storage: storage,
                         omitNull: true}
                    );
                    
                    
// Importar la definición de la tabla Quiz en quiz.js.
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definición de la tabla Comment.
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // Exportar la definición de la tabla Quiz.
exports.Comment = Comment; // Exportar la definición de la tabla Comment.

// Creamos y inializamos la tabla de preguntas.
sequelize.sync().then(function() {
    // success() ejecuta el manejador una vez creada la tabla.
    Quiz.count().then(function(count) {
        if (count === 0) {
            Quiz.create({ pregunta: 'Capital de Italia',
                          respuesta: 'Roma',
                          tema: 'otro'
            })
            Quiz.create({ pregunta: 'Capital de Portugal',
                          respuesta: 'Lisboa',
                          tema: 'otro'
            }).then(function() { console.log('Base de datos inicializada') } );
        };
    });
});
