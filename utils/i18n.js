var keystone = require('keystone');

var locales = [
    {
        label: 'English',
        value: 'en'
    },
    {
        label: 'Deutsch',
        value: 'de'
    },
    {
        label: '简体中文',
        value: 'zh'
    }
];

exports.locales = locales;

exports.translateRental = function(rental, language, cb) {
    keystone.list('RentalText').model.findOne({ slug: rental.slug, language: language}).exec(function(err, text) {
        if (err)
            return cb(err);
        if (text) {
            // translate
            rental.description = text.description;
        }
        cb();
    });
};
