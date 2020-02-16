const nodemailer=require('nodemailer')

// optoins will be post method email address
var sendEmail=async (options)=>{
    // create transporter: the keys must be exactly the same matching nodemailer.
    var transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD,
        }
    })
    // transporter params: the keys must be exactly the same matching nodemailer.
    var emailOptions={
        from:'john liu <johnliu@johnliu.com>',
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    // send email
    await transporter.sendMail(emailOptions)
}

module.exports=sendEmail

