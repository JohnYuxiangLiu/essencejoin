var express = require("express");
var app = new express();

var userController = require("../controllers/userController");
var authController = require("../controllers/authController");

// auth
// singup
app.route("/signup").post(authController.signup);
// signin
app.route("/signin").post(authController.signin);
// forgot password post email
app.route("/forgotPassword").post(authController.forgotPassword);
// reset password get token
app.route("/resetPassword/:token").patch(authController.resetPassword);
// update password after sign in
app
  .route("/updatePassword")
  .patch(authController.authSignin, authController.updatePassword);

//   user
app
  .route("/")
  .post(userController.createUser)
  // .get(authController.authSignin,userController.getUser);
  .get(userController.getUser);

// don't enable: Check your routes. It might be that two routes have the same starting point example "#GET /user/:userID and #GET /user/list". The route will use "list" as an input to the database and will give some error. – Jose Hernandez Jan 26 at 23:26
// app
//   .route("/:id")
//   .get(userController.getUserId)
//   .patch(userController.updateUserId);

// update user details
app
  .route("/updateUser")
  .patch(authController.authSignin, userController.updateUser);
    
// delete user: set it to inactive
app
  .route("/deleteUser")
  .delete(authController.authSignin, userController.deleteUser)
  

module.exports = app;
