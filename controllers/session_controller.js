// Get /login Formulario de login.
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {}
    
    res.render('sessions/new', {errors: errors});
};

// POST /login Crear la sesión.
exports.create = function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    
    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {
        if (error) { // Si hay error devolvemos el mensaje de error de sesión.
            req.session.errors = [{"message": 'Se ha producido un error: ' + error }];
            res.redirect("/login");
            return;
        }
        
        // Crear req.session.user y guardar los campos id y username.
        // La sessión se define por la existencia de req.session.user
        req.session.user = {id: user.id, username: user.username};
        
        res.redirect(req.session.redir.toString()); // Redirección al path anterior al login.
    });
};

// DELETE /logout Destruir la sesión.
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); // Redirección al path anterior al login.
};
