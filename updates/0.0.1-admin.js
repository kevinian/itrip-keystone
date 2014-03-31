var async = require('async'),
    keystone = require('keystone'),
    User = keystone.list('User');

var users = [
    {
        name: { first: 'Junxiang', last: 'Wei' },
        email: 'kevinprotoss.wei@gmail.com',
        password: '65575791',
        canAccessKeystone: true
    },
    {
        name: { first: 'Zengliang', last: 'He' },
        email: 'hezengliang@gmail.com',
        password: 'admin',
        canAccessKeystone: true
    }
];
 
exports = module.exports = function(done) {
    async.each(users, importUser, done);
};

var importUser = function(user, cb) {
    // Import new admin user
    new User.model(user).save(cb);
};
