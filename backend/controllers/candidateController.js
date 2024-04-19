const examModel = require("../models/examModel")
const userModel = require("../models/userModel")


const getExamActiveById = async(req,res) => {
    try{
       const exam = await examModel.find({company: req.params.id, active: true})
       if(exam){
        res.send({
          message: "Exams list fetched successfully.",
          data: exam,
          success: true
        })
       }
       else{
        res.send({
          message: "No exams to display.",
          data: exam,
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

  const getUserInfoById = async(req,res) => {
    try{
        const user = await userModel.findOne(
            { _id: req.params.id },
            { profileImage: 1, companyName: 1, companyDescription: 1, companyCity: 1 }
          );
       if(user){
         res.status(200).send({
             message: "User Info fetched successfully",
             data: user,
             success: true
         })
       }
       else{
         res.status(200).send({
             message: "Failed to fetch user info",
             data: null,
             success: false
         })
       }
    }
    catch(error){
        console.error(error)
     res.status(400).send({
         message: error.message,
         data: error,
         success: false
     })
    }
 }

  module.exports = { getExamActiveById, getUserInfoById }