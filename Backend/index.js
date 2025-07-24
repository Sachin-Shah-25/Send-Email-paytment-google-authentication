require("dotenv").config()
const express = require('express')
const app = express();
const cors = require('cors')
const sessions = require('express-session')
const passport = require('passport')
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')

// const upload = multer({ dest: './static/uploads' })
const path = require('path')
const router = require("./Routers/router");
const cookieParser = require("cookie-parser");

const cor = {
    origin: process.env.HOST_URL || 'http://localhost:5173',
    credentials: true
}
app.use(sessions({
    secret: process.env.SESSION_ID,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))



app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, "static")))
app.use(cors(cor))
app.use(cookieParser())

app.use("/email", router)
app.use("/user/signup",router)
app.use("/user/signin", router)
app.use('/create',router)
app.use('/payment',router)


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},(token,refreshToken,profile,done)=>{
    return done(null,profile)
}))

passport.serializeUser((user,done)=> {
   return done(null,user.displayName)
})
passport.deserializeUser((user,done)=> done(null,user))


app.get("/", (req, res) => {
    return res.status(200).json({ "success": true, "res": "Done Bro" })
})
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get('/auth/google/callback',passport.authenticate("google",
    {
        failureRedirect:'/auth/signin'
    }
),(req,res)=>{
    const getUsername = req.session.passport.user
    const token=jwt.sign({"username":getUsername},
                    process.env.SECRET_KEY,
                    {
                        expiresIn:'1d'
                    }
                )
                res.cookie('token',token,{
                    httpOnly:true,
                    maxAge: 24 * 1000 * 60 * 60 * 3,
                })
    return res.send('Logged in successfully');
})

app.get('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send("Logout failed");
            }
            res.clearCookie('connect.sid')
            res.clearCookie('token')
            return res.redirect('/');
    });
});
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.log('Error connecting to MongoDB Atlas:', err));

app.listen(8000, () => {
    console.log("Server Started")
})
