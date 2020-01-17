const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const UserModel=require('./database/models/UserModel')
const UserController=require('./controllers/UserController')


const app=new express()



// mongoose
mongoose.connect('mongodb://localhost/essencejoin')

// use
app.use(express.static('public')) //static files except html
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// route
// get
app.get('/',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"pages/index.html"))
})



// post
app.post('/signin',UserController)


app.listen(3000,()=>console.log("listening on port 3000"))

