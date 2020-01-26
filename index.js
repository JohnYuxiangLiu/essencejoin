const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

var activityRoute=require('./routes/activityRoute')
var userRoute=require('./routes/userRoute')
var session = require("express-session");

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

// route
app.route("/").get((req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/index.html"));
});
app.route("/signin").get((req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/user/signin.html"));
});
app.use('/user',userRoute)
app.use('/activity',activityRoute)

app.listen(3000, () => console.log("listening on port 3000"));
