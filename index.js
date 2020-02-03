const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

var dotenv=require('dotenv').config({path:'./config.env'})
var activityRoute=require('./routes/activityRoute')
var userRoute=require('./routes/userRoute')
var session = require("express-session");
var errorGlobal=require('./utils/errorGlobal')
var errorController=require('./controllers/errorController')

const app = new express();

// mongoose
mongoose.connect("mongodb://localhost/essencejoin");

// use
app.use(express.static("public")); //static files except html
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
// session
var sess = {
  secret: "keyboard cat",
  cookie: {},
  resave: false,
  saveUninitialized: false
};
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));
//////////////////////////////////////////////////////

// middleware
// run before route
app.use((req,res,next)=>{
  // console.log(req.headers)
  next()
})


////////////////////////////////////////////////////////
// route
app.route("/").get((req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/index.html"));
});
app.route("/signin").get((req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/user/signin.html"));
});
app.use('/user',userRoute)
app.use('/activity',activityRoute)

// error msg for all other routes unspecified
app.all('*',(req,res,next)=>{
  // putting arg in next() will skip all middlewares to global error middleware
  next(new errorGlobal(404,`Cannot find ${req.originalUrl} on the server`))
})

// express global error middleware, defined with arg err in front
app.use(errorController)

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));
