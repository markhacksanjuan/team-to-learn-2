const mongoose = require('mongoose')
const User = require('../../models/user.model')

mongoose.connect(`mongodb://localhost/${process.env.DATABASE}`)

const users = {
    name: 'mark',
    lasName: 'sanjuan',
    email: 'mark@mark.com',
    password: 'mark'
}

User
    .create(users)
    .then(data => {
        console.log(data)
        mongoose.connection.close()
    })
    .catch(err => {
        console.error(err)
    })