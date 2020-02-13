const activityModel = require("../models/activityModel");
const errorGlobal=require('../utils/errorGlobal')

exports.getActivity = async (req, res) => {
  try {
    // var activity = await activityModel.find().lean();
    var activity = await activityModel.find({}).lean();
    
    
    res.status(200).json({
      status: "success",
      data: activity
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

exports.deleteActivity=async (req,res,next)=>{
  try{
    var activity=await activityModel.findByIdAndDelete(req.params.id)
    if(!activity){
      return next(new errorGlobal(404,'Cannot find activity by ID.'))
    }
    res.status(200).json({
      status:'success',
      data:null,
    })
  }catch(err){
    next(new errorGlobal(404,'Cannot delete activity by ID.'))
  }
}

// https://mongoosejs.com/docs/tutorials/lean.html#using-lean
