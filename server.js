
const mongoose = require("mongoose");
var dotenv=require('dotenv').config({path:'./config.env'})
var app=require('./index')

// mongoose
mongoose.connect("mongodb://localhost/essencejoin");

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}\nEnvironment is set to: ${process.env.NODE_ENV}`));

