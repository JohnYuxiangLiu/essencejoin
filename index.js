const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser')
// express-rate-limit can only be install to local not global
const expressRateLimit=require('express-rate-limit')
// helmet
const helmet=require('helmet')
// expressMongoSanitize
const expressMongoSanitize=require('express-mongo-sanitize')
// xss-clean
const xssClean=require('xss-clean')

var activityRoute=require('./routes/activityRoute')
var userRoute=require('./routes/userRoute')
var errorGlobal=require('./utils/errorGlobal')
var errorController=require('./controllers/errorController')
//////////////////////////////////////////////////////////////

// instantiate express
const app = new express();
////////////////////////////////////////////////////////////////

// set
// set pug template engine
app.set('view engine','pug')
// use path __dirname join to avoid path passed from without /
app.set('views',path.join(__dirname,'views'))

/////////////////////////////////////////////////////////////////

// use: setup
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
// helmet:
app.use(helmet())
// expressMongoSanitize: e.g. remove $ char when using "email":{"$gt":""} to signin
app.use(expressMongoSanitize())
// xss clean: insert html with js code attached to attack
// convert "username": "<div id='bad'>name</div>" to "username": "&lt;div id='bad'>name&lt;/div>",
app.use(xssClean())


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
  res.status(200).render('base',{
    user:'user mongodb',
    activity:'activity mongodb'
  })
});
// or
// app.get('/',(req,res)=>{
//   res.status(200).render('base')
// })
app.route("/signin").get((req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/user/signin.html"));
});
app.use('/api/user',userRoute)
app.use('/api/activity',activityRoute)

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
