const customError = require("../error/custom-error")

module.exports.catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (err) {
            next(new customError(`${err}`, 500, 'fail'))
        }
    }
}