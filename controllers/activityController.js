const activityModel = require("../models/activityModel");
const errorGlobal=require('../utils/errorGlobal')
const crudFunction=require('./crudFunction')

exports.getActivity = async (req, res) => {
  try {
    // var activity = await activityModel.find().lean();
    var activity = await activityModel.find({})
    
    
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

// get 1 activity by id
exports.getActivityId = async (req, res) => {
  try {
    // var activity = await activityModel.find().lean();
    var activity = await activityModel.findById(req.params.id).populate('user')
    
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

// delete activity by id
exports.deleteActivity=crudFunction.deleteOne(activityModel)


// https://mongoosejs.com/docs/tutorials/lean.html#using-lean
