const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username required"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email required"],
    lowercase: true,
    validate: [validator.isEmail, "Valid email required"]
  },
  password: {
    type: String,
    required: [true, "Password required"]
  },
  passwordConfirm: {
    type: String,
    required: [true, "Confirm password required"],
    validate: {
      validator: function(val) {
        if (val !== this.password) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
});

// you have to use function instead of ()=> for this.?
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);

  //   delete passwordConfirm after auth
  this.passwordConfirm = undefined;
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
