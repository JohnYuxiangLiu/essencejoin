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
    // validator npm
    validate: [validator.isEmail, "Valid email required"]
  },
  password: {
    type: String,
    required: [true, "Password required"],
    // not send password in query from client
    select:false,
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

// instance method based on mongoose userSchema
userSchema.methods.checkPassword=async function(inputPassword,storedPassword){
  return await bcryptjs.compare(inputPassword,storedPassword) //return true or false
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
