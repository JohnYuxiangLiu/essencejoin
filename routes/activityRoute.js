
var express=require('express')
var app=new express()
var activityController=require('../controllers/activityController')


//   activity
app.route("/").get(activityController.getActivity);

module.exports=app