var keystone = require('keystone'),
    Types = keystone.Field.Types;
 
var Review = new keystone.List('Review', {
    map: { name: 'title' },
    defaultSort: '-publishedAt'
});
 
Review.add({
    title: { type: Types.Text, required: true, initial: true },
    rate: { type: Types.Number, required: true, initial: true },
    comment: { type: Types.Textarea },
    author: { type: Types.Relationship, ref: 'User' },
    publishedAt: { type: Date, default: Date.now }
});
 
Review.defaultColumns = 'title, author, publishedAt'; 

Review.register();