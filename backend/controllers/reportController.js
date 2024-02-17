const Report = require("../models/reportModel")
const Exam = require("../models/examModel")
const User = require("../models/userModel");
const candidateModel = require("../models/candidateModel");
const examModel = require("../models/examModel");

//add attempts

const addReport = async(req,res) => {
    try{
       const { email, exam, user } = req.body;

       const existingReport = await Report.findOne({ user, exam });

        if (existingReport) {
            return res.status(400).json({
                message: "A report already exists for this user and test",
                success: false
            });
        }
        
       const report = new Report(req.body);
       await report.save();
       const reportId = report._id;

       const candidate = await candidateModel.findOneAndUpdate(
           { email: email },
           { $set: { "tests.$[elem].report": reportId } },
           { arrayFilters: [{ "elem.testId": req.body.exam }] }
       );

       const examUpdate = await examModel.findOneAndUpdate(
            { _id: exam, "candidates.candidate": candidate._id },
            { $set: { "candidates.$.report": reportId } }
        );
       res.send({
        message: "Attempt added successfully",
        data: null,
        success: true
       })
    }
    catch(error){
        res.send({
            message: error.message,
            data: error,
            success: false
        })
    }
}

// get all attempts
const getAllAttempts = async(req,res) => {
    try{
        const user_admin = await User.findOne({
            _id: req.body.userid
        })
        if(user_admin.isAdmin){
            const { examName, userName } = req.body
            const exam = await Exam.find({
                name: {
                    $regex: examName,
                }, 
            })
            const matchedExamIds = exam.map((exam)=>exam._id)
            const user = await User.find({
                name: {
                    $regex: userName,
                }, 
            })
            const matchedUserIds = user.map((user)=>user._id)
            const reports = await Report.find({
                exam: {
                  $in: matchedExamIds,
                },
                user: {
                  $in: matchedUserIds,
                },
            }).populate("exam").populate("user").sort({createdAt: -1})
            if(reports){
                res.send({
                    message: "All Attempts fetched successfully.",
                    data: reports,
                    success: true
                })
            }
            else{
                res.send({
                    message: "No Attempts to display.",
                    data: null,
                    success: false
                })
            }   
        }
        else{
            res.send({
                message: "Cannot Fetch All Attempts.",
                data: null,
                success: false
            })
        }
    }
    catch(error){
        res.send({
            message: error.message,
            data: error,
            success: false
        })
    }
}

const getAllAttemptsByUser = async(req,res) => {
    try{
        const reports = await Report.find({user: req.body.userid}).populate("exam").populate("user").sort({createdAt: -1})
        if(reports){
            res.send({
                message: "All Attempts fetched successfully.",
                data: reports,
                success: true
            })
        }
        else{
            res.send({
                message: "No Attempts to display.",
                data: null,
                success: false
            })
        }
    }
    catch(error){
        res.send({
            message: error.message,
            data: error,
            success: false
        })
    }
}


module.exports = {addReport,getAllAttempts, getAllAttemptsByUser}
