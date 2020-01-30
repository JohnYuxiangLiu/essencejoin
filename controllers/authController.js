const userModel=require('../models/userModel')
const jwt=require('jsonwebtoken')

exports.signup=async (req,res,next)=>{
    try{
        var newUser=await userModel.create(req.body)

        var token=await jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})

        res.status(201).json({
            status:'success',
            token,
            data:newUser,
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}