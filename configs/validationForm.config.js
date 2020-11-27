const functions   = require('../functions/functions')

const checkForm = (req, res, next) => {
    const newUser = req.body
    if(newUser.email === ''){
        res.render('auth/signup', {errorMessage: 'Tienes que introducir un e-mail'})
        return
    }
    if(!functions.isEmail(newUser.email)){
        res.render('auth/signup', {errorMessage: 'Tienes que introducir un e-mail válido'})
        return
    }
    if(newUser.password === ''){
        res.render('auth/signup', {errorMessage: 'Tienes que introducir una contraseña'})
        return
    }
    if(functions.isValidPwd(newUser.password)[1]){
        res.render('auth/signup', {errorMessage: functions.isValidPwd(newUser.password)[1].errorMessage, newUser})
        return
    }

    next()
}

module.exports = { checkForm }