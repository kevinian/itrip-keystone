var keystone = require('keystone'),
  	async = require('async');

exports = module.exports = function(req, res) {
	
  var view = new keystone.View(req, res),
      locals = res.locals;
  
  locals.section = 'login';
  locals.formData = req.body || {};
  locals.validationErrors = {};
  locals.enquirySubmitted = false;
  
  view.on('init', function(next) {
    console.log('init');
    next();
  });
  
  view.on('post', { action: 'login' },  function(next) {
    console.log('post');
    locals.enquirySubmitted = true;
    next();
  });
  
  view.on('get', function(next) {
    console.log('get');
    next();
  });
  
  view.render('login');
	
};
