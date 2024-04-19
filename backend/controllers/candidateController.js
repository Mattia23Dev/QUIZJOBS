const examModel = require("../models/examModel")


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

  module.exports = { getExamActiveById }