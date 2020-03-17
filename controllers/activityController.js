const activityModel = require("../models/activityModel");
const errorGlobal = require("../utils/errorGlobal");
const crudFunction = require("./crudFunction");

exports.getActivity = async (req, res) => {
  try {
    // var activity = await activityModel.find().lean();
    var activity = await activityModel.find({});

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
exports.getActivityId = crudFunction.getOne(activityModel, { path: "user" });

// delete activity by id
exports.deleteActivity = crudFunction.deleteOne(activityModel);

// within certain radius to find how many activities
exports.getActivityDistance = async (req, res, next) => {
  // activityDistance/:distance/center/:latlon/unit/:unit
  // http://localhost:3000/activity/activityDistance/5000/center/37.7840242,-122.4316821/unit/mi
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new errorGlobal(400, "Cannot find Lattitude and Longitude"));
  }

  const activity = await activityModel.find({
    locations: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: "success",
    // number of activity within the range
    result: activity.length,
    data: activity
  });
};

// https://mongoosejs.com/docs/tutorials/lean.html#using-lean
