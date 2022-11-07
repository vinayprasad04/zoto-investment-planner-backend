const express=require('express')
const { signup, login, conformEmail, changePassword, forgetPassword, reSetPassword } = require('../controller/authController')
const router=express.Router()

//auth pis

router.post('/login',login)
router.post('/signup',signup)
router.post('/conformemail',conformEmail)
router.patch('/changepassword',changePassword)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword',reSetPassword)



module.exports=router