var express = require("express");
var app = new express();

var userController = require("../controllers/userController");
var authController = require("../controllers/authController");

// auth
// singup
app.route("/signup").post(authController.signup);
// signin
app.route("/signin").post(authController.signin)
// forgot password post email
app.route("/forgotPassword").post(authController.forgotPassword)
// reset password get token
app.route("/resetPassword/:token").patch(authController.resetPassword)
// update password after sign in
app.route("/updatePassword").patch(authController.authSignin,authController.updatePassword)

//   user
app
  .route("/")
  .post(userController.createUser)
  .get(userController.getUser);

app
  .route("/:id")
  .get(userController.getUserId)
  .patch(userController.updateUserId);

module.exports = app;
