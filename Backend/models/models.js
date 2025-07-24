const mongoose=require('mongoose')



const create_model=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String
    },
    password:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    }
},{timestamps:true})

const usermodel=mongoose.model("user",create_model)


module.exports = usermodel