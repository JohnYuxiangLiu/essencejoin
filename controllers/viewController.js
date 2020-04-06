const activityModel = require("../models/activityModel");

exports.getOverview = async (req, res) => {
  try {
    //1. find all activities from database collection
    const activities = await activityModel.find();

    //2. build template

    //3. render template

    res.status(200).render("overview", {
      title: "All Activities",
      activities,
    });
  } catch (err) {
    next(err);
  }
};

exports.getActivity = (req, res) => {
  res.status(200).render("activity", {
    data: "activity data",
  });
};

exports.getActivityId = async (req, res) => {
  // 1. get data
  const activityId = await activityModel
    .findOne({ _id: req.params.id })
    // path:'user' the user is from activitySchema.virtual("user",
    // role username email are fields populated from user
    .populate( "user", "role username email" );
    console.log(activityId)
  // 2. render template

  // 3. render template with data

  res.status(200).render("activity", {
    title: "Activity by Id",
    activityId,
  });
};
