const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  activityName: {
    type: String,
    unique: true,
    required: [true, "Activity name required"],
  },
  users:[{
    type: mongoose.Schema.ObjectId,
    ref: "User",
  }],
  // in compass analysising location is not available in community version
  locations: 
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    },
},

  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
);
///////////////////////////////////////////////////////////////////////////////

// indexing
// geo sphere index must put here to make geoSpatial func work
activitySchema.index({locations:'2dsphere'})

/////////////////////////////////////////////////////////////////////////////////
// virtuals populate: will not store in db, only show data when query
activitySchema.virtual("user",{
  ref: "User",
  // foreignField is the shcema field userActivity in user model
  foreignField: "activity",
  // userModel's info is stored in activityModel's _id field
  localField: "_id",
})

const activityModel = mongoose.model("Activity", activitySchema);

module.exports = activityModel;
