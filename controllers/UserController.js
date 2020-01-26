const userModel = require("../models/userModel");


exports.postUser = async (req, res) => {
  try {
    var user = await userModel.create(req.body)


    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      massage: err
    });
  }
};


exports.getUser = async (req, res) => {
    try {
      var getUser = await userModel
        .find()
        .lean();
  
      res.status(200).json({
        status: "success",
        data: getUser
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        massage: err
      });
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
