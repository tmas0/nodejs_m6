var models = require('../models/models.js');

// Get /quizes/statistics
exports.stats = function(req, res, next) {
    models.Quiz.count().then(
        function(npregs) {
            models.Comment.count().then(
                function(ncomments) {
                    models.Quiz.findAll({
                        include: [{model: models.Comment}]
                    }).then(
                        function(pregs) {
                            var pregconcomentarios = 0;
                            var pregwithoutcomments = 0;
                            for( i in pregs ) {
                                if (pregs[i].comments.length) {
                                    pregconcomentarios++;
                                } else {
                                    pregwithoutcomments++;
                                }
                            }
                            var media = ncomments/npregs; 
                            media = media.toFixed(2);
                            res.render('quizes/statistics', {nquizes: npregs, ncomments: ncomments, nquizeswithcomments: pregconcomentarios, nquizeswithoutcomments: pregwithoutcomments, media: media, errors: []});
                        }
                    );
                }
            );
	    }
    );
};
