const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken')
const multer=require('multer')

// Token verify 
const verifyToken=(req,res,next)=>{
    token=req.cookies.token
    if (!token){
        return next()
    }
    else {
        
        const verified= jwt.verify(token,process.env.SECRET_KEY)
        if (verified){
          req.user=verified
          return res.send("Welcome Again : "+req.user.username)
        }
        return res.status(401).json({"success":false,"data":"","msg":"Login Again"})

    }
}

// Image Upload setup
const storage=multer.diskStorage({
    
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()} - ${file.originalname}`)
    },
    destination:(req,file,cb)=>{
        return cb(null,"../static/uploads")
    }
})

//  Create Creation 
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        'user':process.env.USER,
        'pass':process.env.GOOGLE_SECRET_KEY
    }
})
const createmail={
    from:process.env.FROM,
    to:process.env.TO,
    subject:"Thanks !",
    text:"If you are seeing this, it means my hard work has been successful."

}

const upload=multer({storage:storage})
module.exports={verifyToken,upload,transporter,createmail}




