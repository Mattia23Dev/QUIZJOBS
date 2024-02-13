const mongoose = require('mongoose')
const Question = require("./questionModel")

const examSchema = new mongoose.Schema({
    numOfQuestions: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    generalSector: {
        type: String,
        required: true
    },
    jobPosition: {
        type: String,
        required: true
    },
    testLanguage: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    questions: {
        type: [Object],
        required: true,
    },
    idEsame: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: true
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates"
    }],
    examLink: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

// remove all the questions associated with an exam if that exam is deleted
examSchema.post('remove',async function(res, next){
    await Question.deleteMany({exam: this._id});
    next();
})

const examModel = mongoose.model("exams", examSchema)

module.exports = examModel