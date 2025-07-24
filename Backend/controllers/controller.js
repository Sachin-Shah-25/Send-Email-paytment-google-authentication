const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const { transporter,createmail } = require('../services/service');
const razor=require("razorpay");
const crypto = require('crypto');
const usermodel=require('../models/models');


const SignUp = async (req, res) => {
    try {   
        const { username, email, password } = req.body
        const imagename=req.files.filename || "image.jpeg"
        
        const isUserExists=await usermodel.findOne({'email':email})
        if (isUserExists) return res.status(400).json({
            "success":false,
            "data":"",
            "message":"User Already Exists"
        })

        const make_hash = await bcrypt.hash(password, 10);

        await usermodel.create({
            username:username,
            email:email,
            password:make_hash,
            image:imagename
        })

        return res.status(200).json({ "success": true, "data": "", "msg": "Account Created" })

    } catch (error) {
        return res.json({ "success": false, "data": "", "msg": error.message || "Something Went wrong " })
    }
}
const SigIn = async (req, res) => {
    try {
        let { email, password } = req.body
        const isUserExists=await usermodel.findOne({email})
        if (!isUserExists) return res.status(400).json({
            "success":false,
            "data":"",
            "message":"Email not registred"
        })
        
        const real_pass = isUserExists.password

        const make_hash = await bcrypt.compare(password, real_pass);
        if (!make_hash) return res.status(401).json({ "success": false, "data": "", "msg": "Incorrect Password !" })
            
            const token=jwt.sign({"username":isUserExists.username},
                process.env.SECRET_KEY,
                {
                    expiresIn:'1d'
                }
            )
            res.cookie('token',token,{
                httpOnly:true,
                maxAge: 24 * 1000 * 60 * 60 * 3,
            })
        return res.status(200).json({ "success": true, "data": "", "msg": "Login Successfully","token":token})

    } catch (error) {
        return res.json({ "success": false, "data": "", "msg": error.message || "Something Went wrong " })
    }
}

const sendEmail=(req,res)=>{
    setTimeout(async() => {
        try {
            await transporter.sendMail(createmail)
            return res.json(200).json({
                "success":true,
                "data":"",
                "msg":"Email has send"
            })
        } catch (error) {
            return res.json(500).json({
                "success":false,
                "data":"",
                "msg":error.msg || "Email has send"
            })
        }
    }, 100);
}

const razorpay=new razor({
    key_id:process.env.RAZOR_KEY_ID,
    key_secret:process.env.RAZOR_KEY_SECRET
})

const paymentfunction=async(req,res)=>{
try {
        const options={
            amount:2500,
            currency:'INR',
            receipt: 'Make_this_unique ' // It will help tracing order
        }
        const orders= await razorpay.orders.create(options)
        console.log("orders hai ", orders)
        return res.status(200).json({"success":true,"data":"","msg":orders})
    } catch (error) {
    return res.status(500).json({"success":false,"data":"","msg": error.message || "Something went wrong"})
    }
}

const paymentverifyFun=(req,res)=>{
     const {razorpay_payment_id,razorpay_order_id,razorpay_signature}=req.body

     console.log("ouer match ")
    
    
    const verify_password=crypto.
    createHmac('sha256',process.env.RAZOR_KEY_SECRET)
    .update(razorpay_order_id+ "|"+razorpay_payment_id)
    .digest("hex");

    console.log(verify_password, "  ",razorpay_signature)

    if (verify_password===razorpay_signature){
        return res.status(200).json({
            "success":true,
            "data":"",
             "msg":"Payment Successfully"
        })
    }

    return res.status(400).json({
            "success":false,
            "data":"",
             "msg":"Payment failed"
        })
}



module.exports = {SigIn,SignUp,sendEmail,paymentfunction,paymentverifyFun}
