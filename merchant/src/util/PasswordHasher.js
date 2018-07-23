const crypto = require('crypto');

exports.generateHash = (password, salt) => {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};