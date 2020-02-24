const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser')
// express-rate-limit can only be install to local not global
const expressRateLimit=require('express-rate-limit')

var activityRoute=require('./routes/activityRoute')
var userRoute=require('./routes/userRoute')
var errorGlobal=require('./utils/errorGlobal')
var errorController=require('./controllers/errorController')
//////////////////////////////////////////////////////////////

// instantiate express
const app = new express();
////////////////////////////////////////////////////////////////

// use
// static files
app.use(express.static("public")); //static files except html
// bodyparser
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
// cookie parser
app.use(cookieParser())
// express rate limit
app.use(expressRateLimit({
  // within how long time frame, in ms
  windowMs:60*60*1000,
  // 100 attemps to query, after that will show Too many requests, please try again later. 
  max:100,
}))

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

// error
// error route: error msg for all other routes unspecified
app.all('*',(req,res,next)=>{
  // putting arg in next() will skip all middlewares to global error middleware
  next(new errorGlobal(404,`Cannot find ${req.originalUrl} on the server`))
})
// express global error middleware: defined with arg err in front
app.use(errorController)

// export to server.js
module.exports=app
