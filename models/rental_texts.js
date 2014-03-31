var keystone = require('keystone'),
    Types = keystone.Field.Types;

var locales = require('../utils/i18n').locales;

var RentalText = new keystone.List('RentalText', {
    label: 'Rental-translations',
    path: 'rental_texts',
    defaultSort: 'slug'
});
 
RentalText.add({
    name: { type: String , initial: true },
    slug: { type: String , index: true, required: true, initial: true },
    language: { type: Types.Select, options: locales, required: true, initial: true },
    description: { type: Types.Html }
});

RentalText.defaultColumns = 'slug, language, name';

RentalText.register();