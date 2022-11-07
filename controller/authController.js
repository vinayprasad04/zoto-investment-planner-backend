const customError = require("../error/custom-error")
const userDataBase = require('../db/model/user')
const { catchAsync } = require("../utils/catch-async")
const { passwordEncode, passwordDecode } = require("../utils/password-encode-decode")
const { createToken } = require("../utils/create-verify-token")
const nodemailer = require("nodemailer");


module.exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new customError('please entre all the detail', 404))
    }
    const userData = await userDataBase.findOne({ email })
    if (!userData) {
        return next(new customError('please enter the correct email', 400))
    }
    const passwordcheck = await passwordDecode(password, userData.password)
    if (!passwordcheck) {
        return next(new customError('please enter correct email and password', 400))
    }
    const token = await createToken({ name: userData.name, email,time:userData.passwordChangeTime })
    res.status(200).json({
        status: 'login',
        name: userData.name,
        email,
        token
    })

})


module.exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password, rePassword } = req.body
    if (!name || !email || !password || !rePassword) {
        return next(new customError('please entre all the detail', 404))
    }
    if (password !== rePassword) {
        return next(new customError('please enter the same password', 400))
    }
    const PasswordEncode = await passwordEncode(password)
    const time=parseInt(new Date().getTime() / 1000, 10)
    const token = await createToken({ name, email,time })
    await userDataBase.create({ name, email, password: PasswordEncode, passwordChangeTime: time })
    res.status(200).json({
        status: 'signup',
        token,
        userDetail: {
            name,
            email
        }
    })

})


module.exports.conformEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return next(new customError('please entre email', 404))
    }
    const userData = await userDataBase.findOne({ email })
    if (!userData) {
        return next(new customError('please enter the correct email', 400))
    }
    res.status(200).json({
        status: 'verify',
        email
    })
})


module.exports.changePassword = catchAsync(async (req, res, next) => {
    const { email, password, newPassword, reNewPassword } = req.body
    if (!email || !password || !newPassword || !reNewPassword) {
        return next(new customError('please enter all the detail', 404))
    }
    const userData = await userDataBase.findOne({ email })
    if (userData) {
        const passwordcheck = await passwordDecode(password, userData.password)
        if (!passwordcheck) {
            return next(new customError('please enter correct password', 400))
        }
        if (newPassword !== reNewPassword) {
            return next(new customError('please enter the same new password', 400))
        }
        const PasswordEncode = await passwordEncode(newPassword)
        await userDataBase.findOneAndUpdate({ email }, { password: PasswordEncode, passwordChangeTime: parseInt(new Date().getTime() / 1000, 10) })
        res.status(200).json({
            status: 'success',
            message: 'password update successfully'
        })
    }
})


module.exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return next(new customError('please entre the email', 404))
    }
    generateCode = Math.floor(1000 + Math.random() * 9000)
    process.env.generateCode=generateCode
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'swapnilsetu1@gmail.com',
            pass: 'qhfmueckvtohnkhv'
        }
    });

    await transporter.sendMail({
        from: "swapnilsetu1@gmail.com", // sender address
        to: email, // list of receivers
        subject: "code", // Subject line
        text: `${generateCode}`, // plain text body
    }, (err) => {
        if (err) {
            next(new customError('nodemailer error', 500))
        } else {
            res.status(200).json({
                status: 'success',
                message: "mail send successfully please check your mail"
            })
        }
    })


})

module.exports.reSetPassword = catchAsync(async (req, res, next) => {
    const { code, email, newPassword, reNewPassword } = req.body
    if (!email || !code || !newPassword || !reNewPassword) {
        return next(new customError('please enter all the detail', 404))
    }
    console.log(code, process.env.generateCode)
    if (code !== process.env.generateCode) {
        return next(new customError('please enter correct code', 400))
    }
    if (newPassword !== reNewPassword) {
        return next(new customError('please enter the same new password', 400))
    }
    const PasswordEncode = await passwordEncode(newPassword)
    await userDataBase.findOneAndUpdate({ email }, { password: PasswordEncode, passwordChangeTime: parseInt(new Date().getTime() / 1000, 10) })
    res.status(200).json({
        status: 'success',
        message: 'password update successfully'
    })
})