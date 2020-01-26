const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    activityName: String
  }
);

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;
