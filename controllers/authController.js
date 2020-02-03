const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const errorGlobal=require('../utils/errorGlobal')

// sign token function, avoid repetition
const signToken = async id => {
  var token = await jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

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

// authorisation with token to access protected pages
exports.authSignin = async (req, res, next) => {
  // get token from user req
  let token;
  if (
    req.headers.authorisation &&
    req.headers.authorisation.startsWith("bearer")
  ) {
    token = req.headers.authorisation.split(" ")[1];
  }

  if(!token){
    return next(res.json(new errorGlobal(401,'Cannot signin')))
  }  

  // verify the token
  // const {promisify}=require('util')
  const decodeToken=await jwt.verify(token,process.env.JWT_SECRET)
  
  // check if user still exist

  // check if user has changed password

  
  next();
};

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
