var keystone = require('keystone'),
    Types = keystone.Field.Types;
 
var Rental = new keystone.List('Rental', {
    autokey: { path: 'slug', from: 'refSite objectID', unique: true },
    map: { name: 'title' },
    defaultSort: '-publishedAt'
});
 
Rental.add(
    'Characteristics', {
        title: { type: Types.Text, required: true, initial: true },
        slug: { type: String , index: true, noedit: true },
        refSite: { type: String, initial: true },
        objectID: { type: String , required: true, initial: true },
        houseName: { type: Types.Text },
        address: { type: Types.Location },
        type: { type: Types.Select, options: 'house, apartment, room', default: 'house' },
        description: { type: Types.Html, dependsOn: { i18n: true } },
        maxCapacity: { type: Types.Number },
        minStay: { type: Types.Number },
        bedroom: { type: Types.Number },
        price: { type: Types.Money },
        publishedAt: { type: Date, default: Date.now }
    },
    'Contact', {
        ownerName: { type: Types.Name },
        email: { type: Types.Email },
        phone: { type: Types.Number }
    },
    'Feedback',{
        reviews: { type: Types.Relationship, ref: 'Review', many: true }
    },
    'Localization', {
        i18n: { type: Boolean, initial: true, default: false},
        texts: { type: Types.Relationship, ref: 'RentalText', many: true }
    });

Rental.defaultColumns = 'title, slug, publishedAt';

Rental.register();