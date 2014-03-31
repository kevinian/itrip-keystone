var async = require('async'),
    keystone = require('keystone'),
    User = keystone.list('User');

var users = require('../examples/data/adminUsers.json');
 
exports = module.exports = function(done) {
    async.each(users, importUser, done);
};

var importUser = function(user, cb) {
    // Import new admin user
    new User.model(user).save(cb);
};
