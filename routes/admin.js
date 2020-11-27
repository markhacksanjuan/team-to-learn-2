const express                                           = require('express')
const router                                            = express.Router()
const User                                              = require('../models/user.model')
const Test                                              = require('../models/test.model')
const Question                                          = require('../models/question.model')
const { checkForAuthentication, isSuperAdmin, isAdmin } = require('../configs/authentication.config')

router.get('/', checkForAuthentication, isAdmin,(req, res, next) => {
    const user = req.user
    res.render('admin/indexAdmin', {user})
})
router.get('/user', checkForAuthentication, isAdmin, (req, res, next) => {
    const user = req.user
    User.find()
        .then(users => {
            res.render('admin/editUserAdmin', {user, users})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/user/:id', checkForAuthentication, isAdmin, (req, res, next) => {
    const id = req.params.id
    const user = req.user
    User.findById(id)
        .then(userFound => {
            res.render('admin/editUserFormAdmin', {user, userFound})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/user/:id', checkForAuthentication, isAdmin, (req, res, next) => {
    const id = req.params.id
    const user = req.user
    const newUser = req.body
    User.findOneAndUpdate({_id: id}, newUser)
        .then(userEdited => {
            res.redirect('/admin/user')
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/user/:id/delete', checkForAuthentication, isSuperAdmin, (req, res, next) => {
    const id = req.params.id
    const user = req.user
    User.findByIdAndRemove({_id: id})
        .then(removedUser => {
            res.redirect('/admin/user')
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/not-verified', checkForAuthentication, isSuperAdmin, (req, res, next) => {
    const user = req.user
    User.find({isVerified: false})
        .then(users => {
            res.render('admin/editNotVerified', {user, users})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/not-verified/delete', checkForAuthentication, isSuperAdmin, (req, res, next) => {
    const user = req.user
    User.deleteMany({isVerified: false})
        .then(users => {
            res.redirect('/admin/not-verified')
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/test', checkForAuthentication, isAdmin, (req, res, next) => {
    const user = req.user
    Test.find()
        .then(tests => {
            res.render('admin/editTestAdmin', {user, tests})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/test/:id', checkForAuthentication, isAdmin, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Test.findById(id)
        .then(test => {
            res.render('admin/editTestFormAdmin', {user, test})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/test/:id', checkForAuthentication, isAdmin, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    const editedTest = req.body
    Test.findOneAndUpdate({_id: id}, editedTest)
        .then(testEdited => {
            res.redirect('/admin/test')
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/test/:id/questions', checkForAuthentication, isAdmin, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Test.findById(id)
        .populate('questions')
        .then(test => {
            res.render('admin/editQuestionsAdmin', {user, test})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/question/:id/edit', checkForAuthentication, isAdmin, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Question.findById(id)
        .then(question => {
            res.render('admin/editQuestionsFormAdmin', {user, question})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/question/:id/edit', checkForAuthentication, isAdmin, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    const questionEdit = req.body
    Question.findOneAndUpdate({_id: id}, questionEdit)
        .then(editedQuestion => {
            res.redirect(`/admin/test/${editedQuestion.testId}/questions`)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/question/:id/delete', checkForAuthentication, isAdmin, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Question.findOneAndRemove({_id: id})
        .then(result => {
            res.redirect(`/admin/test/${result.testId}/questions`)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})

module.exports = router