var keystone = require('keystone'),
    Types = keystone.Field.Types;
 
var Rental = new keystone.List('Rental');
 
Rental.add({
    name: { type: Types.Name, required: true, index: true },
    email: { type: Types.Email, initial: true, required: true, index: true },
    password: { type: Types.Password, initial: true },
    canAccessKeystone: { type: Boolean, initial: true }
});
 
Rental.register();