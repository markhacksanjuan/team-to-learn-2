const express                                            = require('express')
const router                                             = express.Router()
const Question                                           = require('../models/question.model')
const {checkForAuthentication, isOwner, isOwnerQuestion} = require('../configs/authentication.config')


router.get('/:id/edit', checkForAuthentication, isOwnerQuestion, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Question.findById({_id: id})
            .then(question => {
                res.render('test/questionsFormEdit', {question, user})
            })
            .catch(err => {
                console.error(err)
                res.send(err)
            })
})
router.post('/:id/edit', checkForAuthentication, isOwnerQuestion, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Question.findOneAndUpdate({_id: id}, req.body)
            .then(result => {
                res.redirect(`/test/${result.testId}`)
            })
            .catch(err => {
                console.error(err)
                res.send(err)
            })
})
router.get('/:id/delete', checkForAuthentication, isOwnerQuestion, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Question.findOneAndDelete({_id: id})
        .then(result => {
            res.redirect(`/test/${result.testId}`)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})


module.exports = router