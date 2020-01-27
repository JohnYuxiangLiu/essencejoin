const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:[true,'Username required']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'Email required'],

    },
    password:{
        type:String,
        required:true,
    }
})

const userModel=mongoose.model('User',userSchema)

module.exports=userModel

