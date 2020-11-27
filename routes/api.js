const express = require('express')
const router  = express.Router()
const Test    = require('../models/test.model')

router.get('/all', (req, res, next) => {
    Test.find()
        .sort({createdAt: -1})
        .then(tests => {
            res.json(tests)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/subject/:subject', (req, res, next) => {
    const subject = req.params.subject
    Test.find({subject})
        .sort({createdAt: -1})
        .then(test => {
            res.json(test)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/title/:title', (req, res, next) => {
    const title = req.params.title
    Test.find({title})
        .sort({createdAt: -1})
        .then(test => {
            res.json(test)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})

module.exports = router