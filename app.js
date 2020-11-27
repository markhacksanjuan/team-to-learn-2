require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require ('express')
const session = require('express-session')
const favicon = require('serve-favicon')
const hbs = require('hbs')
const path = require ('path')
const chalk = require('chalk')
const passport = require('passport')
const flash = require('connect-flash')

// -------------------- DATABASE CONFIGURATION --------------------
require('./configs/db.config')

// --------------- EXPRESS ---------------
const app = express()

// ------------------ PORT ----------------
const PORT = process.env.PORT || 3000

// ---------------------- MIDDLEWARE SETUP ------------------
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(flash())


// ----------------- SESSION CONFIGURATION ------------------
app.use(session({
    secret: `${process.env.DATABASE}`,
    resave: true,
    saveUninitialized: true
}))
//  -------------- PASSPORT CONFIGURATION -------------------
require('./configs/passport.config')

// ------------------ MIDDLEWARE PASSPORT -------------------
app.use(passport.initialize())
app.use(passport.session())

// ------------------ HBS ------------------ Express View Engine Setup
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
hbs.registerPartials(path.join(__dirname, '/views/partials'))


// -------------------- ROUTES -----------------------
const index = require('./routes/index')
app.use('/', index)
const auth = require('./routes/auth')
app.use('/auth', auth)
const test = require('./routes/test')
app.use('/test', test)
const question = require('./routes/question')
app.use('/question', question)
const dashboard = require('./routes/dashboard')
app.use('/dashboard', dashboard)
const user = require('./routes/user')
app.use('/user', user)
const api = require('./routes/api')
app.use('/api', api)
const admin = require('./routes/admin')
app.use('/admin', admin)

// ---------------- ERROR ROUTES ---------------

app.use((req,res,next) => {
    res.status(404)
    res.render('not-found')
})
// app.use((err, req, res, next) => {
//     if(!res.headersSent) {
//         res.status(500)
//         res.render('error')
//     }
// })


// ------------------- LISTEN ---------------------
app.listen(PORT, () => {
    console.log(chalk.blue.inverse.bold('conectado'))
})