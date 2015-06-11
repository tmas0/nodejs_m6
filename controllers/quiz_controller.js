var models = require('../models/models.js');

// Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
    models.Quiz.find(quizId).then(
        function(quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next( new Error('No existe el quizId=' + quizId) );
            }
        }
    ).catch( function(error) { next(error); } );
};

// Get /quizes
exports.index = function(req, res) {
    // Debemos comprobar si el usuario esta buscando algo.
    var busqueda = req.query.search;
    if (busqueda) {
        busqueda = '%' + busqueda + '%';
        models.Quiz.findAll( {where:["pregunta like ?", busqueda.replace(/ /, '%') ] } ).then(
            function(quizes) {
                res.render('quizes/index', { quizes: quizes });
            }
        ).catch(function(error) { next(error); });
    } else {
        models.Quiz.findAll().then(
            function(quizes) {
                res.render('quizes/index', { quizes: quizes, errors: [] });
            }
        ).catch(function(error) { next(error); } );
    }
};

// Get /quizes/:id
exports.show = function(req, res) {
    models.Quiz.find(req.params.quizId).then(
        function(quiz) {
	        res.render('quizes/show', {quiz: req.quiz, errors: [] });
	    }
	);
};

// Get /quizes/:id/answer
exports.answer = function(req, res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    }
    res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res) {
    var quiz = models.Quiz.build(
        {pregunta: "Pregunta", respuesta: "Respuesta"}
    );
    
    res.render('quizes/new', {quiz: quiz, errors: [] } );
};

// POST /quizes/create
exports.create = function(req, res) {
    var quiz = models.Quiz.build( req.body.quiz );
    
    // Validamos el quiz.
    var err = quiz.validate();
    
    if (err) {
        var i = 0;
        var errores = new Array();
        for (var theerror in err) {
            errores[i++] = {message: err[theerror]};
        }
        res.render('quizes/new', {quiz: quiz, errors: errores});
    } else {
        quiz.save({fields: ["pregunta", "respuesta"]}).then(
            function(){
                res.redirect('/quizes'); // Redirección a la lista de preguntas.
            }
        );
    }
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
    var quiz = req.quiz; // Autoload de instancia de quiz.
    
    res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    
    // Validamos el quiz.
    var err = req.quiz.validate();
    
    if (err) {
        var i = 0;
        var errores = new Array();
        for (var theerror in err) {
            errores[i++] = {message: err[theerror]};
        }
        res.render('quizes/edit', {quiz: req.quiz, errors: errores});
    } else {
        req.quiz // Guarda los campos en la BD.
        .save( {fields: ["pregunta", "respuesta"]} )
        .then( function() { res.redirect('/quizes');});
    }
};
