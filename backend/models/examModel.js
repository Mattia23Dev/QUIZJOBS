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
    description: {
        type: String,
    },
    tag: {
        type: String,
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
        candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates"
        },
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reports"
        },
        status: {
            type: String,
            default: "Da contattare"
        },
        trackLink: {
            type: String
        },
        skills: {
            type: String,
        },
        education: {
            type: String,
        },
        workExperience: {
            type: String,
        },
        preferito: {
            type: Boolean,
            default: false,
        },
        note: {
            type: String,
        },
        date: {
            type: Date,
            default: new Date()
        },
        summary: {
            type: String,
        },
    }],
    examLink: {
        type: String,
    },
    trackLink: [String],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    jobDescription: {
        type: String
    },
    jobCity: {
        type: String,
    },
    jobContract: {
        type: String,
    },
    jobTypeWork: {
        type: String,
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