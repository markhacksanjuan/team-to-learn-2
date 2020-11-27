const express                  = require('express')
const uploadCloud              = require('../configs/cloudinary.config')
const router                   = express.Router()
const User                     = require('../models/user.model')
const Test                     = require('../models/test.model')
const {checkForAuthentication} = require('../configs/authentication.config')

router.get('/',checkForAuthentication, (req, res, next) => {
    const user = req.user
    Test.find({author: user._id})
        .then(tests => {
            res.render('users/userInfo', {user, tests})
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/:id/edit', checkForAuthentication, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    res.render('users/userEditForm', {user})
})

router.post('/:id/edit', checkForAuthentication, (req, res, next) => {
    const user = req.user
    const id = req.params.id
    const editedUser = req.body
    User.findOneAndUpdate({_id: user._id}, editedUser)
        .then(result => {
            res.redirect('/user')
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})
router.get('/:id/edit/avatar', checkForAuthentication, (req, res, next) => {
    const user = req.user
    res.render('users/userEditAvatar', {user})
})
router.post('/:id/edit/avatar', checkForAuthentication, uploadCloud.single('avatar'), (req, res, next) => {
    const user = req.user
    const imgPath = req.file.path
    const imgName = req.file.originalname
    const editedUser = {
        imgName,
        imgPath
    }
    User.findOneAndUpdate({_id: user._id}, editedUser)
        .then(result => {
            res.redirect(`/user`)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
})

module.exports = router