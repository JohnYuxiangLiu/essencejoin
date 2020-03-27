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
/////////////////////////////////////////////////////////////////////////////////

// get 1 activity by id
exports.getActivityId = crudFunction.getOne(activityModel, { path: "user" });
/////////////////////////////////////////////////////////////////////////////////

// delete activity by id
exports.deleteActivity = crudFunction.deleteOne(activityModel);
/////////////////////////////////////////////////////////////////////////////////

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
////////////////////////////////////////////////////////////////////////////

// get nearby activity distances
// must have index as 2dsphere to work
exports.getActivityNearDistance = async (req, res, next) => {
  // activityNearDistance/:latlon/unit/:unit
  // http://localhost:3000/activity/activityNearDistance/37.7840242,-122.4316821/unit/mi
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new errorGlobal(400, "Cannot find Lattitude and Longitude"));
  }

  // aggregate an array of aggregation
  const activity = await activityModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          // *1 convert to number
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: "distance", //where all distance to be stored
        // distanceMultiplier times the output meters to 0.001 to km
        distanceMultiplier: multiplier,
      }
    },
    {
      // $project mean to only keep what output variables in display
      $project: {
        // 1 means to keep the variable
        activityName: 1,
        locations: 1,
        distance: 1,
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    // number of activity within the range
    result: activity.length,
    data: activity
  });
};

// https://mongoosejs.com/docs/tutorials/lean.html#using-lean
