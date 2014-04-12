var async = require('async'),
    keystone = require('keystone'),
    geode = require('geode'),
    geo = new geode('kevinprotoss'),
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
        phone: { type: Types.Number },
        address: { type: Types.Location }
    },
    'Feedback',{
        reviews: { type: Types.Relationship, ref: 'Review', many: true }
    },
    'Localization', {
        i18n: { type: Boolean, initial: true, default: false},
        texts: { type: Types.Relationship, ref: 'RentalText', many: true }
    });
    
Rental.schema.add({
    geonames: { type: [Number] }
});

var findGeoname = function(geonames, cb) {
    var hashMap = {};
    async.each(geonames, function(geoname, ascb) {
        hashMap[geoname.fcode] = geoname;
        ascb();
    }, function() {
        // feature_code priority chain PPLC, PPLA, PPLA2, PPLA3, PPLA4, PPL, ignore the rest
        var geoname = hashMap.PPLC || hashMap.PPLA || hashMap.PPLA2 || hashMap.PPLA3 || hashMap.PPLA4 || hashMap.PPL;
        cb(geoname);
    });
};

var sanitize = function(next) {
    var thiz = this;
    thiz.geonames = [];
    if (thiz.address && thiz.address.country && thiz.address.suburb) {
        async.waterfall([
            function(ascb) {
                geo.search({name: thiz.address.suburb, country: thiz.address.country, fclass: 'P'}, function(err, data){
                    if (err)
                        return ascb(err);
                    if (!data || !data.totalResultsCount || !data.geonames)
                        return ascb();
                    if (data.totalResultsCount > 1) {
                        findGeoname(data.geonames, function(geoname) {
                            // Sanitize
                            thiz.address.suburb = geoname.name;
                            thiz.address.country = geoname.countryCode;
                            // thiz.address.lng = geoname.lng;
                            // thiz.address.lat = geoname.lat;
                            ascb(null, geoname.geonameId);
                        });
                    } else {
                        ascb(null, data.geonames[0].geonameId);
                    }
                });
            },
            function(geonameId, ascb) {
                // Set geonames
                if (!geonameId)
                    return ascb();
                geo.hierarchy({geonameId: geonameId}, function(err, data){
                    if (err)
                        return ascb(err);
                    if (!data || !data.geonames)
                        return ascb();
                    async.each(data.geonames, function(geoname, done) {
                        thiz.geonames.push(geoname.geonameId);
                        done();
                    }, ascb);
                });
            }
        ], next);
    } else {
        next();
    }
};

Rental.schema.pre('save', sanitize);

Rental.defaultColumns = 'title, slug, publishedAt';

Rental.register();