const mongoose = require('mongoose')
const Schema = mongoose.Schema

const questionSchema = new Schema(
    {
        question: {
            type: String
        },
        validAnswers: [String],
        wrongAnswers: [String],
        testId: Schema.Types.ObjectId
    }
)

const Question = mongoose.model('Question', questionSchema)
module.exports = Question