const UserModel = require('../database/models/UserModel')

const UserController=(req,res)=>{
UserModel.findOne({
    $and: [{
            email: req.body.email.toLowerCase()
        },
        {
            password: req.body.password
        }
    ]
}, (error, result) => {
    if(error){
        return
    }
    if(!result){
        console.log('no data')
    }else{
        // res.json(result)
        res.redirect('/')
    }
})
}

module.exports=UserController