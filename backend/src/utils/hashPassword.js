const crypto = require('crypto')

function hashPassword(password, salt) {

    return crypto
        .createHash('sha256')
        .update(password + salt)
        .digest()
}

module.exports = hashPassword