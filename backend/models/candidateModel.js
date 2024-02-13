const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    cv: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    },
    tests: [{
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "exams"
        },
        score: {
            type: Number,
            required: true
        },
        correctAnswers: {
            type: Number,
            required: true
        },
        totalQuestions: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const candidateModel = mongoose.model("candidates", candidateSchema)

module.exports = candidateModel