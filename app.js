// Load .env for development environments
require('dotenv')().load();

var keystone = require('keystone'),
    i18n= require('i18n');

/**
 * Application Initialisation
 */

keystone.init({

	'name': 'Itrip-Keystone',
	'brand': 'Creative Group',
	
	'port': process.env.PORT || 8080,

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'jade',

	'auto update': true,
	'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/itrip-keystone',

	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'itrip'
});

require('./models');

i18n.configure({
    locales:['en', 'de'],
    directory: __dirname + '/locales'
});

keystone.set('routes', require('./routes'));

keystone.start();