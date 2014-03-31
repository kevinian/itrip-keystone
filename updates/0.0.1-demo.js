var async = require('async'),
    keystone = require('keystone'),
    Rental = keystone.list('Rental'),
    Review = keystone.list('Review'),
    RentalText = keystone.list('RentalText');

/**
 * Demo data
 */

var rentals = [
    {
        title: 'House Wei',
        refSite: 'www.fewo-direct.de',
        objectID: '1001',
        description: 'i18n key',
        reviews: [
            {
                title: 'Terrible',
                rate: 3
            },
            {
                title: 'OK',
                rate: 4
            }
        ],
        texts: [
            {
                name: 'house wei text en',
                language: 'en',
                description: 'My holiday house!'
            },
            {
                name: 'house wei text de',
                language: 'de',
                description: 'Mein Ferienhaus!'
            },
            {
                name: 'house wei text zh',
                language: 'zh',
                description: '我的度假屋!'
            }
        ]
    },
    {
        title: 'House He',
        refSite: 'www.wimdu.com',
        objectID: '1002',
        description: 'i18n key',
        i18n: true,
        reviews: [
            {
                title: 'Just super!!!',
                rate: 5
            },
            {
                title: 'Not so good.',
                rate: 4
            }
        ],
        texts: [
            {
                name: 'house he text en',
                language: 'en',
                description: 'Best of best!'
            },
            {
                name: 'house he text de',
                language: 'de',
                description: 'Perfekt!'
            },
            {
                name: 'house he text zh',
                language: 'zh',
                description: '我的别墅!'
            }
        ]
    }
];

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