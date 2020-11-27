const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.model')
const bcrypt = require('bcrypt')


// ------------- SERIALIZE & DESERIALIZE USER ---------------
passport.serializeUser((user, callback) => {
    callback(null, user._id)
})
passport.deserializeUser((id, callback) => {
    User.findById(id)
        .then(user => {
            callback(null, user)
        })
        .catch(err => callback(err))
})

// ----------------- SET STRATEGY -------------------
passport.use(new LocalStrategy({usernameField: 'email',passReqToCallback: true}, (req, username, password, next) => {
    User.findOne({ email: username })
        .then(user => {
            if(user){
                bcrypt.compare(password, user.password)
                    .then(response => {
                        if(!response){
                            next(null, false, {message: 'Incorrect username or password'})
                        }else {
                            next(null, user)
                        }
                    })
            }else {
                next(null, false, {message: 'Incorrect username or password'})
            }
        })
        .catch(err => {
            console.error(err)
            next(err)
        })
}))