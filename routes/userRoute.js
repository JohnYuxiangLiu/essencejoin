var express = require("express");
var app = new express();

var userController = require("../controllers/userController");
var authController = require("../controllers/authController");

// singin
app.route("/signup").post(authController.signup);

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
