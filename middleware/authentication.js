const customError = require("../error/custom-error");
const { catchAsync } = require("../utils/catch-async");
const jwt = require('jsonwebtoken')
const userDataBase = require('../db/model/user')

module.exports.authenticationMiddleware = catchAsync(async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return next(new customError('please enter the token', 404))
    }
    const verify = await jwt.verify(token, process.env.secret)

    if (!verify) {
        return next(new customError('not authorised', 400))
    }
    const data=await userDataBase.findOne({email:verify.email})
    if(!data){
        return next(new customError('this user is remove',400))
    }
    if(verify.time<data.passwordChangeTime){
        return next(new customError('please login again',400))
    }
    
    req.userData = { name: verify.name, email: verify.email }
    next()

})