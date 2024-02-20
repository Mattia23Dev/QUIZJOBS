const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: new Date()
    },
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
    experience: {
        type: String,
    },
    degree: {
        type: String,
        required: true
    },
    tests: [{
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "exams"
        },
        progress: {
            questionIndex: {
              type: Number
            },
            selectedOption: {
              type: String
            }
        },
        score: {
            type: Number,
        },
        correctAnswers: {
            type: Number,
        },
        totalQuestions: {
            type: Number,
        },
        arrayAnswers: {
            answers: {
                type: mongoose.Schema.Types.Mixed,
            },
            questions: {
                type: mongoose.Schema.Types.Mixed,
            },
            seconds: {
                type: mongoose.Schema.Types.Mixed,
            }
        },
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reports"
        },
    }],
    status: {
        type: String,
        default: "Da contattare"
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const candidateModel = mongoose.model("candidates", candidateSchema)

module.exports = candidateModel