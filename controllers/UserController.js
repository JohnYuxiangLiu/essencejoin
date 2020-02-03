const userModel = require("../models/userModel");
const errorGlobal=require('../utils/errorGlobal')

exports.createUser = async (req, res) => {
  try {
    var createUser = await userModel.create({
      username:req.body.username,
      email:req.body.email,
      password:req.body.password,
      passwordConfirm:req.body.passwordConfirm,
    });

    res.status(200).json({
      status: "success",
      data: createUser
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

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

// /:id
exports.getUserId = async (req, res, next) => {
  try {
    const getUserId = await userModel.findById(req.params.id);

    res.json({
      status: "success",
      data: getUserId
    });
  } catch (err) {
      next(err)
  }
};
exports.updateUserId = async (req, res,next) => {
  try {
    var updateUserId = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { runValidators: true }
    );

    res.json({
      status: "success",
      data: updateUserId
    });
  } catch (err) {
      next(err)
  }
};

// const fs = require("fs");
// var templateReplace = require("../functions/userFunction");

//   authentication
//   .findOne({
//     $and: [
//       {
//         email: req.body.email.toLowerCase()
//       },
//       {
//         password: req.body.password
//       }
//     ]
//   })
//   .lean();

// // replace template html with data
// if (error) {
//     res.redirect('/signin')
//     return
// }
// if (!result) {
//     console.log('no data')
//     res.redirect('/signin')
// } else {
//     req.session.username = result.username

//     // templateReplace
//     var template = fs.readFileSync(('./pages/user/user.html'), 'utf-8')

//     // convert to array
//     var resultArr = [result]

//     var data = resultArr.map(el => {
//             return templateReplace(template,el)
//     }).join('')
//     console.log(data)
//     res.send(data)

// }
// https://mongoosejs.com/docs/tutorials/lean.html#using-lean
