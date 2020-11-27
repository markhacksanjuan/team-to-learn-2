const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        name: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        testsDone: {
            type: [Schema.Types.ObjectId],
        },
        testsPassed: {
            type: [Schema.Types.ObjectId],
        },
        imgName: {
            type: String,
            default: 'user0'
        },
        imgPath: {
            type: String,
            default: 'https://res.cloudinary.com/dbmvibcpr/image/upload/v1606147539/team-to-learn-users/user0.png'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ['ADMIN', 'GUEST'],
            default: 'GUEST'
        },
        passwordResetToken: String,
        passwordResetExpires: Date
    },
    {
        timestamps: true
    }

)

const User = mongoose.model('User', userSchema)
module.exports = User