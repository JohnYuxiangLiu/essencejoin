var express = require("express");
var app = new express();
var activityController = require("../controllers/activityController");
var authController = require("../controllers/authController");

//   activity
app.route("/").get(authController.authSignin, activityController.getActivity);
app
  .route("/:id")
  .get(
    authController.authSignin,
    authController.authorisation("admin"), //only admin can perform certain actions
    activityController.deleteActivity,
  );

module.exports = app;
