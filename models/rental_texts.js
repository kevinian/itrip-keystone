var keystone = require('keystone'),
    Types = keystone.Field.Types;

var locales = require('../utils/i18n').locales;

var RentalText = new keystone.List('RentalText', {
    label: 'Rental-translations',
    path: 'rental_texts',
});
 
RentalText.add({
    name: { type: String , initial: true },
    language: { type: Types.Select, options: locales, required: true, initial: true },
    description: { type: Types.Html }
});

RentalText.defaultColumns = 'name, language';

RentalText.register();