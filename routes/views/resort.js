var async = require('async'),
    keystone = require('keystone'),
    geode = require('geode'),
    geo = new geode('kevinprotoss');
    
var math = require('../../utils/math');
var i18n = require('../../utils/i18n');

exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'resort';
    locals.filters = {
		geoname: req.params.geoname || '6295630' // Default geonameId of `world`
	};
    locals.data = {
        breadcrumb: [],
        navigation: [],
        rentals: []
    };
    
    view.on('init', function(next) {
        // Load all parent-geonames.
        geo.hierarchy({geonameId: locals.filters.geoname, lang: req.language}, function(err, data){
            if (err)
                return next(err);
            async.map(data.geonames, function(geoname, ascb) {
                // Set current geoname as active
                if (geoname.geonameId === parseInt(locals.filters.geoname, null)) {
                    locals.data.geoname = geoname;
                    geoname.active = true;
                }
                ascb(null, geoname);
            }, function(err, geonames) {
                // No error will be returned here, no need to catch
                locals.data.breadcrumb = geonames;
                next();
            });
        });
    });
    
    view.on('init', function(next) {
        // Load all child-geonames.
        geo.children({geonameId: locals.data.geoname.geonameId, lang: req.language}, function(err, data){
            if (err)
                return next(err);
            locals.data.navigation = data.geonames;
            next();
        });
    });

    view.on('init', function(next) {
        // Get paged rentals and all relevant reviews.
        var q = keystone.list('Rental').paginate({
                    page: req.query.page || 1,
                    perPage: 2,
                    maxPages: 10
                })
                .sort('-publishedAt')
                .populate('reviews');
        
        if (locals.data.geoname) {
			q.where('geonames').equals(locals.data.geoname.geonameId);
		}

        q.exec(function(err, pagedRentals) {
            if (err)
                return next(err);

            locals.data.rentals = pagedRentals;
            next();
        });
    });
    
    view.on('init', function(next) {
        // Format results.
        async.map(locals.data.rentals.results, formatResults.bind({ language: req.language }), function(err, results) {
            if (err)
                return next(err);
            locals.data.rentals.results = results;
            next();
        });
    });

    view.render('resort');
    
};

/**
 * Format results
 */
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