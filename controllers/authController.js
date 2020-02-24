const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const errorGlobal = require("../utils/errorGlobal");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

// functions:
// sign token function, avoid repetition, only this class use it:
const signToken = async id => {
  var token = await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};
//////////////////////////////////////////////////////////////////

// create and send token
const createSendToken = async (user, statusCode, res) => {
  const token = await signToken(user._id);

  // send cookie
  const cookieOptions = {
    // 1day:1000*60*60*24
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  // send cookie
  res.cookie("jwt", token, cookieOptions);

  // res.json() will send back password, because select: false only apply to query data, not create new data
  // remove the passowrd in response but not saved to db
  user.password=undefined

  // send token
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user
    }
  });
};
////////////////////////////////////////////////////////////////////

// filter only allowed fileds to be updated:
// ...: break down an obj
const filterObj = (objs, ...allowedFields) => {
  const newObj = {};
  // loop through objects' keys as arrays, e.g. age,name,email...
  Object.keys(objs).forEach(elt => {
    if (allowedFields.includes(elt)) {
      // assign the values, and keys will be in newObj
      newObj[elt] = objs[elt];
    }
  });
  // contain key and values
  return newObj;
};

/////////////////////////////////////////////////////////////////////

// singup post method
exports.signup = async (req, res, next) => {
  try {
    var newUser = await userModel.create(req.body);

    createSendToken(newUser, 201, res);
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

    createSendToken(user, 200, res);
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
    // Note that Mongoose will cast the provided id value to the type of _id as defined in the schema (defaulting to ObjectId).
    // only id will work: { id: '5e4de233dea5a821543906bd', iat: 1582330065, exp: 1590106065 }
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
  const resetToken = await user.passwordReset();

  // save to userModel: deactivate validation so we can save
  await user.save({ validateBeforeSave: false });

  // send email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/resetPassword/${resetToken}`;
  const message = `Submit a patch request to reset your password, your reset link is ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password token is valid for 60 minutes.",
      message: message
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email."
    });
  } catch (err) {
    // clear the values
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new errorGlobal(500, "Error sending email."));
  }
};
/////////////////////////////////////////////////////////////////////////////

exports.resetPassword = async (req, res, next) => {
  //get url get's token and then encrypt
  const hashToken = await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // match the encrypt token with the one in db and ensure expire date > time now
  const user = await userModel.findOne({
    passwordResetToken: hashToken,
    passwordResetExpire: { $gt: Date.now() }
  });

  //if user doesn't exist
  if (!user) {
    return next(new errorGlobal(400, "Token expired or invalid."));
  }

  // else if user found
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // send token to user to access restricted area
  createSendToken(user, 200, res);
};
//////////////////////////////////////////////////////////////////////////////

// update password
exports.updatePassword = async (req, res, next) => {
  // get current username from collection
  // auto cast _id to id
  const currentUser = await userModel
    .findById(req.user._id)
    .select("+password");

  // check posted password correct
  if (
    !(await currentUser.checkPassword(req.body.password, currentUser.password))
  ) {
    return next(new errorGlobal(401, "Password incorrect."));
  }

  // if so update password, save to db
  currentUser.password = req.body.passwordNew;
  currentUser.passwordConfirm = req.body.passwordNewConfirm;

  // validation is off, so confirm password will be checked
  // not using updateById because the validation in userModel passwordConfirm won't be included; also userModel.pre won't be included as well
  await currentUser.save();

  // login user, send new jwt
  createSendToken(currentUser, 200, res);
};
//////////////////////////////////////////////////////////////////////////////////
