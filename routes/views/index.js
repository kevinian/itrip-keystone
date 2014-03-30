var keystone = require('keystone'),
    async = require("async");
 
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res),
        locals = res.locals;
        
    locals.section = 'index';
        
    locals.data = {};
	
	view.on('init', function(next) {
        var q = keystone.list('Rental').paginate({
                    page: req.query.page || 1,
                    perPage: 10,
                    maxPages: 10
                })
                .sort('-publishedAt')
                .populate('reviews');
        
        q.exec(function(err, pagedRentals) {
            if (err)
                return next(err);
            locals.data.rentals = pagedRentals;
            
            async.map(pagedRentals.results, function(rental, callback) {
                if (!rental.reviews)
                    return callback(null, rental);
                async.reduce(rental.reviews, 0, function(memo, item, ascb){
                    var rate = item.rate || 0;
                    ascb(null, memo + rate);
                }, function(err, result){
                    if (err)
                        return callback(err);
                    rental.avgRate = result;
                    callback(null, rental);
                });
			}, function(err, results) {
                if (err)
                    return next(err);
                locals.data.rentals.results = results;
                next();
			});
        });
	});
	
    view.render('index');
    
}