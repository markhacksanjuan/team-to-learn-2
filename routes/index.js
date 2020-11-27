const express = require('express')
const router                     = express.Router()
const Test                       = require('../models/test.model')
const User                       = require('../models/user.model')
const { checkForAuthentication } = require('../configs/authentication.config')
const functions                  = require('../functions/functions')

router.get('/', (req, res, next) => {
    const user = req.user
    res.render('index', { user })
})
router.get('/dashboard', checkForAuthentication, (req, res, next) => {
    const user = req.user
    if(user.role === 'ADMIN'){
        res.render('dashboard', { user, ADMIN: user.role})
        return
    }
    res.render('dashboard', { user })
})
router.get('/all', (req, res, next) => {
    const user = req.user
    Test.find()
        .sort({createdAt: -1})
        .limit(5)
        .populate('questions')
        .then(tests => {
            const subjectsArr = functions.subjectSelect(tests)
            res.render('allTests', {subjectsArr, user})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/ranking', checkForAuthentication, (req, res, next) => {
    const user = req.user
    User.find()
        .then(users => {
            users.sort((a, b) => {
                return b.testsPassed.length - a.testsPassed.length
            })
            res.render('ranking', {users, user})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})

module.exports = router