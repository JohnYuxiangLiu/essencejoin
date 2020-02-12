const mongoose = require("mongoose");
var dotenv = require("dotenv").config({ path: "./config.env" });
var app = require("./index");

// needs to be before any other code to catch error
process.on('uncaughtException',err=>{
    console.log('Uncaught exception.')
    console.log(err.name,err.message)
    process.exit(1)
})


// mongoose
mongoose.connect("mongodb://localhost/essencejoin");

app.listen(process.env.PORT, () =>
  console.log(
    `listening on port ${process.env.PORT}\nEnvironment is set to: ${process.env.NODE_ENV}`
  )
);

// The 'unhandledRejection' event is emitted whenever a Promise is rejected and no error handler is attached to the promise within a turn of the event loop.
process.on('unhandledRejection',err=>{
    console.log('Unhandled rejection.')
    console.log(err.name,err.message)
})

