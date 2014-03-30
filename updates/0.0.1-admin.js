var keystone = require('keystone'),
    User = keystone.list('User');
 
exports = module.exports = function(done) {
    
    new User.model({
        name: { first: 'Junxiang', last: 'Wei' },
        email: 'kevinprotoss.wei@gmail.com',
        password: '65575791',
        canAccessKeystone: true
    }).save(done);
    
};
