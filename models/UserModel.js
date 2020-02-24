const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");

////////////////////////////////////////////////////////////////////////////////

// schema:
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
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Password required"],
    // not send password in query from client, only apply to query data, doesn't apply to create new data
    select: false
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  active:{
    type:Boolean,
    default:true,
  }
});
////////////////////////////////////////////////////////////////////////////////////

// middleware:
// you have to use function instead of ()=> for this.?
// for every save method
// encrypt password
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);

  //   delete passwordConfirm after auth
  this.passwordConfirm = undefined;
  next();
});

// for every save method: assign value to passwordChangedAt:
userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();

  // -1s due to: saving to db is slower than issuing web token, therefore, make change of password timestamp set after jsonwebtoken created. So user can't login after password changed using the token, e.g. token signToken(user._id) generated before changedPasswordAfter is true:
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// for every method start find rege, execute:
userSchema.pre(/^find/,function(next){
  // don't use active: true because some of the user don't have it set
  this.find({active:{$ne:false}})
  next()
})

/////////////////////////////////////////////////////////////////////////////////////

// instance method based on mongoose userSchema to check user input plain password with encrypted password
userSchema.methods.checkPassword = async function(
  inputPassword,
  storedPassword
) {
  return await bcryptjs.compare(inputPassword, storedPassword); //return true or false
};
/////////////////////////////////////////////////////////////////////////////////////

// if password changed
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    // getTime() convert 2020-02-01 to ms; 10 is base 10
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // return true if password changed after token issued
    return JWTTimestamp < changedTimestamp;
  }
  // return false if password not changed
  return false;
};
//////////////////////////////////////////////////////////////////////////////////////

// create password reset toke and then send by email
userSchema.methods.passwordReset = async function() {
  // generate plain text token email to user, then compare with encrypted passwordResetToken
  // crypto: is inbuild function in nodejs
  const resetToken = await crypto.randomBytes(32).toString("hex");
  //encrypt the random string from resetToken
  this.passwordResetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // reset in 60min in ms
  this.passwordResetExpire = await (Date.now() + 60 * 60 * 1000);

  // send plain token to user for later compare encrypted
  return resetToken;
};



const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
