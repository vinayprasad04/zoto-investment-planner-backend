const express=require('express')
const { account } = require('../controller/account')
const router=express.Router()

//account pis

router.get('/account',account)


module.exports=router