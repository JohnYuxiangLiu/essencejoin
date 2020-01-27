var express = require("express");
var app = new express();

var userController = require("../controllers/userController");

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
