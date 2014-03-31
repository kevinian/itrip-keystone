var async = require('async'),
    keystone = require('keystone');
    
var math = require('../../utils/math');
var i18n = require('../../utils/i18n');

exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'index';

    locals.data = {};

    view.on('init', function(next) {
        // Get paged rentals and all relevant reviews.
        var q = keystone.list('Rental').paginate({
                    page: req.query.page || 1,
                    perPage: 2,
                    maxPages: 10
                })
                .sort('-publishedAt')
                .populate('reviews');

        q.exec(function(err, pagedRentals) {
            if (err)
                return next(err);

            locals.data.rentals = pagedRentals;

            async.map(pagedRentals.results, formatResults.bind({ language: req.language }), function(err, results) {
                if (err)
                    return next(err);
                locals.data.rentals.results = results;
                next();
            });
        });
    });

    view.render('index');
    
};

var formatResults = function(rental, cb) {
    var thiz = this;
    async.waterfall([
        function(next) {
            // Get all i18n texts if i18n feature is set true.
            if (!rental.i18n)
                return next();
            i18n.translateRental(rental, thiz.language, next);
        },
        function(next) {
            // Calculate the average rate for the rental
            if (!rental.reviews)
                return next();
            math.avg(rental.reviews, function(err, result) {
                if (err)
                    return next(err);
                rental.avgRate = result;
                next();
            });
        },
        function(next) {
            // Keep only the first 3 reviews
            if (rental.reviews || rental.reviews.length > 3)
                rental.reviews = rental.reviews.slice(0, 3);
            next(null, rental);
        },
    ], cb);
};