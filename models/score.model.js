const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scoreSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        testId: {
            type: Schema.Types.ObjectId,
            ref: 'Test'
        },
        hits: {
            type: Number
        }
    }
)

const Score = mongoose.model('Score', scoreSchema)
module.exports = Score