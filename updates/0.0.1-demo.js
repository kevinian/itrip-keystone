var async = require("async"),
    keystone = require('keystone'),
    User = keystone.list('User'),
    Rental = keystone.list('Rental'),
    Review = keystone.list('Review'),
    RentalText = keystone.list('RentalText');
 
exports = module.exports = function(done) {
    async.series([
        function(next) {
            // Import new admin user
            new User.model({
                name: { first: 'Junxiang', last: 'Wei' },
                email: 'kevinprotoss.wei@gmail.com',
                password: '65575791',
                canAccessKeystone: true
            }).save(next);
        },
        function(next) {
            // Import new rental
            new Rental.model({
                title: 'House Wei',
                objectID: '1111',
                description: 'i18n key'
            }).save(next);
        },
        function(next) {
            // Import new review
            new Review.model({
                title: 'Just super!!!',
                rate: 5
            }).save(next);
        },
        function(next) {
            // Import new review
            new Review.model({
                title: 'Not so good.',
                rate: 4
            }).save(next);
        },
        function(next) {
            // Import new rental_text
            new RentalText.model({
                name: 'rental translation text',
                slug: '1111',
                language: 'en',
                description: 'My super holiday house!'
            }).save(next);
        },
        function(next) {
            // Import new rental_text
            new RentalText.model({
                name: 'rental translation text zh',
                slug: '1111',
                language: 'zh',
                description: '我的度假屋!'
            }).save(next);
        }
    ], done);
    
};
