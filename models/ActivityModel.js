const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  activityName: {
    type: String,
    unique: true,
    required: [true, "Activity name required"]
  }
});

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;
