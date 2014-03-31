var async = require('async');

exports.avg = function(arr, cb) {
    exports.count(arr, function(err, result) {
        if (err)
            return cb(err);
        cb(null, result / arr.length);
    });
};

exports.count = function(arr, cb) {
    async.reduce(arr, 0, function(memo, item, next){
        var rate = item.rate || 0;
        next(null, memo + rate);
    }, cb);
}