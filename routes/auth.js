const express       = require('express')
const router        = express.Router()
const User          = require('../models/user.model')
const Token         = require('../models/token.model')
const bcrypt        = require('bcrypt')
const passport      = require('passport')
const crypto        = require('crypto')
const transporter   = require('../configs/nodemailer.config')
const functions     = require('../functions/functions')
const { checkForm } = require('../configs/validationForm.config')
const bcryptSalt    = 10

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})
router.post('/signup',checkForm , (req, res, next) => {
    const { email, password } = req.body
    let newUser = req.body
    User.findOne({email: email})
        .then(user => {
            if(!user){
                bcrypt.genSalt(bcryptSalt)
                    .then(salt => {
                        bcrypt.hash(password, salt)
                        .then(hashedPwd => {
                            newUser = {
                                name: req.body.name,
                                lastName: req.body.lastName,
                                email,
                                password: hashedPwd
                            }
                            User.create(newUser)
                                .then(result => {
                                    const newToken = {
                                        userId: result._id,
                                        token: crypto.randomBytes(16).toString('hex')
                                    }
                                    Token.create(newToken)
                                        .then(tokenCreated => {
                                            const message = functions.createTokenEmail(result, tokenCreated)
                                            transporter.sendMail({
                                                from: `'Team to Learn <teamtolearn.webapp@gmail.com>`,
                                                to: result.email,
                                                subject: 'Tu cuenta necesita ser verificada',
                                                html: message
                                            })
                                            .then(info => {
                                                res.redirect('/auth/verification')
                                            })
                                        })
                                })
                        })
                    })
            }else {
                res.render('auth/signup', {errorMessage: 'El email introducido ya existe', newUser})
            }
        })
        .catch(err=> {
            console.error(err)
        })
})
router.get('/login', (req, res, next) => {
    res.render('auth/login', {errorMessage: req.flash('error')})
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
}))
router.get('/verification', (req, res, next) => {
    res.render('auth/verification')
})
router.get('/confirmation/:email/:token', (req, res, next) => {
    const { token, email } = req.params
    Token.findOne({ token })
        .then(token => {
            if(!token){
                res.redirect('/auth/verification')
            }else {
                User.findOne({ email })
                    .then(user => {
                        if(!user){
                            res.redirect('/auth/verification')
                        }
                        if(user.isVerified){
                            res.redirect('/dashboard')
                        }
                        User.findOneAndUpdate({_id: user._id}, {isVerified: true})
                            .then(result => {
                                req.login(result, (err) => {
                                    if(err) { return next(err) }
                                    res.redirect('/dashboard')
                                })
                            })
                    })
            }
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/resend', (req, res, next) => {
    res.render('auth/resendTokenForm')
})
router.post('/resend', (req, res, next) => {
    const email = req.body.email
    if(email === ''){
        res.render('auth/resendTokenForm', {errorMessage: 'Tienes que introducir un e-mail'})
        return
    }
    if(!functions.isEmail(email)){
        res.render('auth/resendTokenForm', {errorMessage: 'Tienes que introducir un e-mail válido'})
        return
    }
    User.findOne({ email })
        .then(user => {
            if(!user){
                res.render('auth/resendTokenForm', {errorMessage: 'No hemos encontrado a ningún usuario con éste e-mail'})
                return
            }
            if(user.isVerified){
                res.render('auth/resendTokenForm', {errorMessage: 'Este usuario ya ha sido verificado.'})
                return
            }
            const newToken = {
                userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            }
            Token.create(newToken)
                .then(tokenCreated => {
                    const message = functions.createTokenEmail(user, tokenCreated)
                    transporter.sendMail({
                        from: `'Team to Learn <teamtolearn.webapp@gmail.com>`,
                        to: result.email,
                        subject: 'Tu cuenta necesita ser verificada',
                        html: message
                        })
                        .then(info => {
                            res.redirect('/auth/verification')
                        })
                })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/resetPwd', (req, res, next) => {
    res.render('auth/resetPwdForm')
})
router.post('/resetPwd', (req, res, next) => {
    const email = req.body.email
    if(email === ''){
        res.render('auth/resetPwdForm', {errorMessage: 'Tienes que introducir un e-mail'})
        return
    }
    if(!functions.isEmail(email)){
        res.render('auth/resetPwdForm', {errorMessage: 'Tienes que introducir un e-mail válido'})
        return
    }
    const newPwdResetToken = crypto.randomBytes(16).toString('hex')
    const hour = 1
    const date = Date.now() + hour*3600*1000
    User.findOneAndUpdate({ email }, {passwordResetToken: newPwdResetToken, passwordResetExpires: date})
        .then(user => {
            if(!user){
                res.render('auth/resetPwdForm', {errorMessage: 'No hemos encontrado a ningún usuario con éste e-mail'})
                return
            }
            const message = functions.createResetTokenPwd(user, newPwdResetToken)
            transporter.sendMail({
                from: `Team to Learn <teamtolearn.webapp@gmail.com>`,
                to: user.email,
                subject: 'Obtener nueva contraseña',
                html: message
                })
                .then(info => {
                    res.redirect('/auth/resetPwdWait')
                })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/resetPwdWait', (req, res, next) => {
    res.render('auth/resetPwdWait')
})
router.get('/resetPwd/:email/:token', (req, res, next) => {
    const { email, token } = req.params
    User.findOne({email})
        .then(user => {
            if(!user){
                res.redirect('/')
                return
            }
            if(user.passwordResetToken === token && user.passwordResetExpires > Date.now()){
                res.render('auth/newPwdForm', user)
            }
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/resetPwd/:email/new', (req, res, next) => {
    const email = req.params
    const newPwd = req.body.password
    bcrypt.genSalt(bcryptSalt)
        .then(salt => {
            bcrypt.hash(newPwd, salt)
            .then(hashedPwd => {
                User.findOneAndUpdate(email, {password: hashedPwd})
                    .then(result => {
                        req.login(result, (err) => {
                            if(err) {return next(err)}
                            res.redirect('/dashboard')
                        })
                    })
            })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/auth/login')
})

module.exports = router