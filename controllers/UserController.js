const userModel = require("../models/userModel");
const errorGlobal = require("../utils/errorGlobal");

// functions
// filter only allowed fileds to be updated:
// ...: break down an obj array
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

exports.createUser = async (req, res, next) => {
  try {
    var createUser = await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    res.status(200).json({
      status: "success",
      data: createUser
    });
  } catch (err) {
    // res.status(404).json({
    //   status: "fail",
    //   message: err
    // });
    next(err);
  }
};
////////////////////////////////////////////////////////////////////////////////

exports.getUser = async (req, res) => {
  try {
    var getUser = await userModel.find().lean();

    res.status(200).json({
      status: "success",
      data: getUser
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
////////////////////////////////////////////////////////////////////////////////

// /:id
exports.getUserId = async (req, res, next) => {
  try {
    const getUserId = await userModel.findById(req.params.id);

    res.json({
      status: "success",
      data: getUserId
    });
  } catch (err) {
    next(err);
  }
};
///////////////////////////////////////////////////////////////////////////////

// route user/:id disabled, can't coexist with user/updateUser
// exports.updateUserId = async (req, res, next) => {
//   try {
//     var updateUserId = await userModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { runValidators: true }
//     );

//     res.json({
//       status: "success",
//       data: updateUserId
//     });
//   } catch (err) {
//     next(err);
//   }
// };
///////////////////////////////////////////////////////////////////////////////

// update user details
exports.updateUser = async (req, res, next) => {
  try {
    // only name and email are allowed to be updated in req.body
    // filteredBody return a object containing multi objs
    var filteredBody = filterObj(req.body, "username", "email", "userActivity");
    
    // new: return new modified doc, runValidators: validate email add etc.,
    // don't use user.save() here because it will run the passwordConfirm validator which passwordConfirm will be mandatory field
    // filteredBody is objects

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};
///////////////////////////////////////////////////////////////////////////////

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.user._id, {
      active: false
    });
    if (!user) {
      return next(404, "Cannot delete user.");
    }

    // in postman has to use 200, if use 204 will return no content
    res.status(200).json({
      status: "success",
      data: null
    });
  } catch (err) {
    return next(err);
  }
};
////////////////////////////////////////////////////////////////////////////


