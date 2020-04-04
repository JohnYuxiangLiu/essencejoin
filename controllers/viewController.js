const activityModel = require("../models/activityModel");

exports.getOverview = async (req, res) => {
  try {
    //1. find all activities from database collection
    const activities=await activityModel.find()

    //2. build template

    //3. render template

    res.status(200).render("overview", {
      title: "All Activities",
      activities,
    });
  } catch (err) {
    next(err)
  }
};

exports.getActivity = (req, res) => {
  res.status(200).render("activity", {
    data: "activity data"
  });
};
