const Test = require('../models/test.model')
const User = require('../models/user.model')
const Question = require('../models/question.model')

const checkForAuthentication = (req, res, next) => {
    if(req.isAuthenticated()) { 
        if(req.user.isVerified){
            return next() 
        }else { res.redirect ('/auth/verification') }
    }
    else { res.redirect('/auth/login') }
}
const isOwner = (req, res, next) => {
    const user = req.user
    const id = req.params.id
    User.findOne({email: user.email})
        .then(user => {
            Test.findById(id)
                .then(test => {
                    if(test.author.toString() === user.id.toString()){
                        next()
                    }else {
                        res.redirect('/dashboard')
                    }
                })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
}
const isOwnerQuestion = (req, res, next) => {
    const user = req.user
    const id = req.params.id
    User.findById({_id: user.id})
        .then(user => {
            Question.findById(id)
                .then(question => {
                    Test.findById({_id: question.testId})
                        .then(test => {
                            if(test.author.toString() === user.id.toString()){
                                next()
                            }else {
                                res.redirect('/dashboard')
                            }
                        })
                })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
}
const isSuperAdmin = (req, res, next) => {
    const user = req.user
    if(user.email === process.env.SUPERADMIN_EMAIL){
        next()
    }else { res.redirect('/') }

}
const isAdmin = (req, res, next) => {
    const user = req.user
    if(user.role === 'ADMIN'){
        next()
    }else { res.redirect('/') }
}


module.exports = { checkForAuthentication, isOwner, isOwnerQuestion, isSuperAdmin, isAdmin }