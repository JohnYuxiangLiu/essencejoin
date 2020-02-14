const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const errorGlobal = require("../utils/errorGlobal");

// sign token function, avoid repetition
exports.signToken = async id => {
  var token = await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};
//////////////////////////////////////////////////////////////////

// singup post method
exports.signup = async (req, res, next) => {
  try {
    var newUser = await userModel.create(req.body);

    var token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: newUser
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
///////////////////////////////////////////////////////////////////////

// signin post method
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // if empty
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
        stack: new Error().stack
      });
    }
    // if user not exist or password not correct
    // password in model select: false, so select + here
    const user = await userModel.findOne({ email: email }).select("+password");
    // user is an instance of userModel, so checkPassword method can be used here
    // without assigning checkPassword to a variable is because if user is false, it will not run
    if (!user || !(await user.checkPassword(password, user.password))) {
      // 401 unauthrised
      return res.status(401).json({
        error: "Incorrect email or password",
        stack: new Error().stack
      });
    }

    var token = await signToken(user._id);
    return res.status(200).json({
      status: "success",
      token
    });
  } catch (err) {
    // move to next with err
    res.status(400).json({
      status: "fail",
      error: err,
      stack: new Error().stack
    });
  }
};
////////////////////////////////////////////////////////////////////////

// authorisation with token to access protected pages
exports.authSignin = async (req, res, next) => {
  try {
    // get token from user req
    let token;
    if (
      req.headers.authorisation &&
      req.headers.authorisation.startsWith("bearer")
    ) {
      token = req.headers.authorisation.split(" ")[1];
    }

    if (!token) {
      return next(new errorGlobal(401, "Cannot signin"));
    }

    // verify the token
    // const {promisify}=require('util')
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);

    // check if user still exist
    const currentUser = await userModel.findById(decodeToken.id);
    if (!currentUser) {
      return next(new errorGlobal(401, "Cannot find user"));
    }
    // check if user has changed password
    if (currentUser.changedPasswordAfter(decodeToken.iat)) {
      return next(
        new errorGlobal(401, "Password changed recently, signin again.")
      );
    }

    // pass user to req.user for future use
    req.user = currentUser;
    // passed auth, next to get data
    next();
  } catch (err) {
    next(err);
  }
};
////////////////////////////////////////////////////////////////////////////

// authorisation: only certain group's can perform certain actions, e.g. admin can delete
exports.authorisation = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new errorGlobal(403, "Cannot grant permission."));
    }
    next();
  };
};
///////////////////////////////////////////////////////////////////////////

exports.forgotPassword = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new errorGlobal(404, "Cannot find user from email."));
  }

  // instantiate a new passwordResetToken, actually user.passwordReset() has been executed. it's just resetToken has not be used
  // user.passwordReset generate this.passwordResetToken, this.passwordResetExpire so they can be saved to database in user.save()
  const resetToken = user.passwordReset();

  // save to userModel: deactivate validation so we can save
  await user.save({ validateBeforeSave: false });
};
/////////////////////////////////////////////////////////////////////////////
