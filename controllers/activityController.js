const activityModel = require("../models/activityModel");

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

// https://mongoosejs.com/docs/tutorials/lean.html#using-lean
