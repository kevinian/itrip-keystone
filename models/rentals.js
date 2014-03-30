var keystone = require('keystone'),
    Types = keystone.Field.Types;
 
var Rental = new keystone.List('Rental', {
    autokey: { path: 'slug', from: 'refSite objectID', unique: true },
    map: { name: 'title' },
    defaultSort: '-publishedAt'
});
 
Rental.add({
    title: { type: Types.Text, required: true, initial: true },
    slug: { type: String , index: true },
    refSite: { type: String },
    objectID: { type: String , required: true, initial: true },
    houseName: { type: Types.Text },
    ownerName: { type: Types.Name },
    address: { type: Types.Location },
    email: { type: Types.Email },
    phone: { type: Types.Number },
    type: { type: Types.Select, options: 'house, apartment, room', default: 'house' },
    description: { type: Types.Html },
    maxCapacity: { type: Types.Number },
    minStay: { type: Types.Number },
    bedroom: { type: Types.Number },
    price: { type: Types.Money },
    publishedAt: { type: Date, default: Date.now },
    reviews: { type: Types.Relationship, ref: 'Review', many: true }
});

Rental.defaultColumns = 'title, slug, publishedAt';

Rental.register();