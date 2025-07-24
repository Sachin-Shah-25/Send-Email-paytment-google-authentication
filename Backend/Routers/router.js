const express=require('express')
const router=express.Router()
const password=require('passport')
const {verifyToken,upload}=require('../services/service')

const {SigIn, SignUp, sendEmail, paymentfunction, paymentverifyFun} = require("../controllers/controller")

router.post('/signup',upload.single("userimage"),SignUp);
router.post('/signin',verifyToken,SigIn);
router.post('/email',verifyToken,sendEmail);
router.post('/order',paymentfunction);
router.post('/verify',paymentverifyFun)



module.exports=router