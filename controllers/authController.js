const userModel=require('../models/userModel')


exports.signup=async (req,res,next)=>{
    try{
        var newUser=await userModel.create(req.body)

        res.status(201).json({
            status:'success',
            data:newUser,
        })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
}