const cryto = require('crypto');
exports.md5 = function md5(str) {
    return str ? cryto.createHash('md5').update(str.toString()).digest('hex') : ''
}