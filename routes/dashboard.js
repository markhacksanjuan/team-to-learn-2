const express                  = require('express')
const router                   = express.Router()
const Test                     = require('../models/test.model')
const Score                    = require('../models/score.model')
const {checkForAuthentication} = require('../configs/authentication.config')

router.get('/test/all', checkForAuthentication, (req, res, next) => {
    const user = req.user
    Test.find({author: user._id})
        .then(tests => {
            res.render('private/myTest', {user, tests})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/results', checkForAuthentication, (req, res, next) => {
    const user = req.user
    Score.find({userId: user.id})
        .populate('userId')
        .populate('testId')
        .then(results => {
            res.render('private/myResults', {user, results})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})

module.exports = router

