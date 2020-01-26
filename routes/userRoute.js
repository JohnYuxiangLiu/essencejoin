var express = require("express");
var app = new express();

var userController = require("../controllers/userController");



//   user
app
  .route("/")
  .post(userController.postUser)
  .get(userController.getUser);

module.exports = app;
