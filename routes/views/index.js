var keystone = require('keystone');
 
exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res),
        locals = res.locals;
        
    locals.section = 'index';
        
    locals.data = {
		rentals: []
	};
	
	view.on('init', function(next) {
	    locals.data.rentals.push(
	        {
		        name: 'House',
		        description: 'Holiday house'
		    }
	    );
	    locals.data.rentals.push(
	        {
		        name: 'Room',
		        description: 'Holiday room'
		    }
	    );
		next();

	});
	
    view.render('index');
    
}