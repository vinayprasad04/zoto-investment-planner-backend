const customError = require("../error/custom-error")

module.exports.notFoundMiddleware = (req, res, next) => {
    next(new customError(`${req.url} is not found`,404,'fail'))
}