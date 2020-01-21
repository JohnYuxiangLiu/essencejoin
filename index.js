const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const UserController = require('./controllers/UserController')
var session = require('express-session')

const app = new express()



// mongoose
mongoose.connect('mongodb://localhost/essencejoin')

// use
app.use(express.static('public')) //static files except html
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
// session
var sess = {
    secret: 'keyboard cat',
    cookie: {},
    resave:false,
    saveUninitialized:false,
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))
//////////////////////////////////////////////////////

// route
// get
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, "pages/index.html"))
})
app.get('/signin',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages/user/signin.html'))
})
app.get('/user',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'pages/user/user.html'))
})


// post
app.post('/user', UserController)


app.listen(3000, () => console.log("listening on port 3000"))