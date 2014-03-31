var async = require('async'),
    keystone = require('keystone'),
    Rental = keystone.list('Rental'),
    Review = keystone.list('Review'),
    RentalText = keystone.list('RentalText');

var rentals = require('../test/data/rentals.json');

exports = module.exports = function(done) {
    async.each(rentals, importRental, done);
};

var importRental = function(rental, cb) {
    // Import new rental
    async.series([
        function(next) {
            // Import reviews and map ref IDs
            async.map(rental.reviews, importReview, next);
        },
        function(next) {
            // Import rental_texts and map ref IDs
            async.map(rental.texts, importRentalText, next);
        }
    ], function(err, results) {
        if (err)
            return cb(err);
        rental.reviews = results[0];
        rental.texts = results[1];
        new Rental.model(rental).save(cb);
    });
};

var importReview = function(review, cb) {
    // Import new review and return ref ID
    new Review.model(review).save(function(err, result) {
        if (err)
            return cb(err);
        cb(null, result._id);
    });
};

var importRentalText = function(rental_text, cb) {
    // Import new rental_text and return ref ID
    new RentalText.model(rental_text).save(function(err, result) {
        if (err)
            return cb(err);
        cb(null, result._id);
    });
};