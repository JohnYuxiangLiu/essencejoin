
var express=require('express')
var app=new express()
var activityController=require('../controllers/activityController')
var authController=require('../controllers/authController')


//   activity
app.route("/").get(authController.authSignin,activityController.getActivity);

module.exports=app