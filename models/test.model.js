const mongoose = require('mongoose')
const Schema = mongoose.Schema

const testSchema = new Schema(
    {
        title: {
            type: String
        },
        subject: {
            type: String
        },
        numValid: {
            type: Number
        },
        author: {
            type: Schema.Types.ObjectId,
        },
        questions: [{
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }],
        done: {
            type:Number,
            default: 0
        },
        passed: {
            type: Number,
            default: 0
        },
        difficulty: {
            type: String,
            enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO']
        }
    },
    {
        timestamps: true
    }
)

const Test = mongoose.model('Test', testSchema)
module.exports = Test