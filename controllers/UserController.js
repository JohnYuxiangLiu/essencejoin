const UserModel = require('../models/UserModel')
const fs = require('fs')
var TemplateReplace = require('../functions/UserFunction')


const UserController = (req, res) => {
    UserModel.findOne({
        $and: [{
                email: req.body.email.toLowerCase()
            },
            {
                password: req.body.password
            }
        ]
    }, (error, result) => {
        if (error) {
            res.redirect('/signin')
            return
        }
        if (!result) {
            console.log('no data')
            res.redirect('/signin')
        } else {
            req.session.username = result.username

            // templateReplace
            var template = fs.readFileSync(('./pages/user/user.html'), 'utf-8')

            // convert to array
            var resultArr = [result]
            
            var data = resultArr.map(el => {
                    return TemplateReplace(template,el)
            }).join('')
            console.log(data)
            res.send(data)

        }
    // https://mongoosejs.com/docs/tutorials/lean.html#using-lean
    }).lean()
}

module.exports = UserController