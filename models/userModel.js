const mongoose=require('mongoose')
const validator=require('validator')

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
        lowercase:true,
        validate:[validator.isEmail,'Valid email required']
    },
    password:{
        type:String,
        required:[true,'Password required']
    },
    passwordConfirm:{
        type:String,
        required:[true,'Confirm password required']
    }
})

const userModel=mongoose.model('User',userSchema)

module.exports=userModel

