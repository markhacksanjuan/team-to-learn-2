const express                           = require('express')
const router                            = express.Router()
const Test                              = require('../models/test.model')
const User                              = require('../models/user.model')
const Question                          = require('../models/question.model')
const Score                             = require('../models/score.model')
const functions                         = require('../functions/functions')
const {checkForAuthentication, isOwner} = require('../configs/authentication.config')
const transporter                       = require('../configs/nodemailer.config')

router.get('/new', checkForAuthentication, (req, res, next) => {
    const user = req.user
    res.render('test/testForm', {user})
})
router.post('/new', checkForAuthentication, (req, res, next) => {
    const user = req.user
    const newTest = req.body
    if(isNaN(Number(newTest.numValid))){
        res.render('test/testForm', {user, errorMessage: 'Número de respuestas válidas incorrecto, tienes que indicar un número.'})
        return
    }
    User.findOne({email: user.email})
        .then(foundUser => {
            newTest.author = foundUser._id
            Test.create(newTest)
                .then(result => {
                    User.findOneAndUpdate({email: user.email}, {$push: {tests: result._id}})
                        .then(() => {
                            res.redirect(`/test/${result._id}`)
                        })
                })
        })
        .catch(err => {
            res.send(err)
            console.error(err)
        })
})
router.get('/:id', checkForAuthentication, isOwner, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Test.findById(id)
        .populate('questions')
        .then(test => {
            res.render('test/test', {test, user})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/:id/question', checkForAuthentication, isOwner, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    res.render('test/questionsForm', {id, user})
})
router.post('/:id/question', checkForAuthentication, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    const { question, validAnswers, wrongAnswers } = req.body
    if(question === '' || validAnswers === '' || wrongAnswers === ''){
        res.render('test/questionsForm', {id, user, errorMessage: 'Tienes que rellenar todos los campos'})
        return
    }
    const newAnswers = functions.checkForValidAnswer(wrongAnswers)

        const newQuestion = {
            question,
            validAnswers,
            wrongAnswers: newAnswers,
            testId: id
        }
        Question.create(newQuestion)
                .then(result => {
                    Test.updateOne({_id: id}, {$push: {questions: result._id}})
                        .then(() => {
                            res.redirect(`/test/${id}`)
                        })
                })
                .catch(err => {
                    console.error(err)
                    res.send(err)
                })

})




router.get('/:id/edit', checkForAuthentication, isOwner, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Test.findById(id)
        .then(test => {
            res.render('test/testFormEdit', {test, user})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/:id/edit', checkForAuthentication, isOwner, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    const editedTest = req.body
    Test.findById(id)
        .then(test => {
            if(isNaN(Number(editedTest.numValid))){
                res.render('test/testFormEdit', {test, user, errorMessage: 'Número de respuestas válidas incorrecto, tienes que indicar un número.'})
                return
            }
            Test.findOneAndUpdate({_id: id}, req.body)
                .then(() => {
                    res.redirect(`/test/${id}`)
                })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/:id/delete', checkForAuthentication, isOwner, (req, res, next) => {
    const user = req.user
    const id = req. params.id
    Test.findOneAndDelete({_id:id})
        .then(result => {
            res.redirect('/dashboard/test/all')
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/:id/send', (req, res, next) => {
    const id = req.params.id
    const user = req.user
    const toUser = req.body
    const message = functions.createEmail(toUser.toName, id)
    transporter.sendMail({
        from: `'Team to Learn' <teamtolearn.webapp@gmail.com>`,
        to: toUser.toEmail,
        subject: '¡Te han enviado un test!',
        html: message
    })
    .then(info => {
            res.redirect(`/test/do/${id}`)
    })
    .catch(err => console.error(err))
})
router.get('/do/:id', (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Test.findById(id)
        .populate('questions')
        .then(test => {
            const newAnswers = functions.newAnswers(test)

            res.render('test/do-test', {test, user, newAnswers})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.post('/do/:id', (req, res, next) => {
    const user = req.user
    const id = req.params.id
    const answers = req.body
    Test.findById(id)
        .populate('questions')
        .then(test => {
            const result = functions.checkTest(test, answers)
            setTimeout(() => {
                let passed = test.passed
                let done = test.done
                if(result >= test.numValid){ passed++ }
                done++
                const newTest = {
                    done,
                    passed
                }
                
                Test.findOneAndUpdate({_id: id}, newTest)
                    .then(updatedTest => {   
                        if(user){
                            const newScore = {
                                userId: user._id,
                                testId: id,
                                hits: result
                            }
                            Score.create(newScore)
                                .then(scoreAdded => {
                                    if(result >= test.numValid){
                                        User.findOneAndUpdate({_id: user._id}, {$push: {testsDone: id, testsPassed: id}})
                                        .then(updatedUser => {
                                            res.render('test/done-test', {user, test, result, total: test.questions.length})
                                        })
                                    return
                                    }
                                })
                            User.findOneAndUpdate({_id: user._id}, {$push: {testsDone: id}})
                                .then(updatedUser => {
                                    res.render('test/done-test', {user, test, result, total: test.questions.length})
                                })
                            return
                        }
                        res.render('test/done-test', {user, test, result, total: test.questions.length})   
            })
            },100)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})

module.exports = router