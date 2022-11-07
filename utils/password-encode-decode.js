const bcrypt = require('bcrypt')
module.exports.passwordEncode = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

module.exports.passwordDecode = (password, encodePassword) => {
    return bcrypt.compare(password, encodePassword)
}