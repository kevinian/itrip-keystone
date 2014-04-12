var _ = require('underscore'),
    keystone = require('keystone');
 
/**
    Initialises the standard view locals.
    Include anything that should be initialised before route controllers are executed.
*/
exports.initLocals = function(req, res, next) {
    
    var locals = res.locals;
    
    locals.navLinks = [
		{ label: 'Home', key: 'home', href: '/' },
		{ label: 'Resort', key: 'resort', href: '/resort' },
		{ label: 'Forum', href: 'http://community.nodebb.org/' },
		{ label: 'Contact', key: 'contact', href: '/contact' }
	];
    
    locals.user = req.user;
    
    // Add your own local variables here
    
    next();
    
};
 
/**
    Inits the error handler functions into `req`
*/
exports.initErrorHandlers = function(req, res, next) {
    
    res.err = function(err, title, message) {
        res.status(500).render('errors/500', {
            err: err,
            errorTitle: title,
            errorMsg: message
        });
    }
    
    res.notfound = function(title, message) {
        res.status(404).render('errors/404', {
            errorTitle: title,
            errorMsg: message
        });
    }
    
    next();
    
};