const candidateModel = require("../models/candidateModel")
const examModel = require("../models/examModel")
const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


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

 const registerCandidate = async (req, res) => {
  console.log(req.body)
   try{
     const userExists = await candidateModel.findOne({email: req.body.email})
     if(userExists){
        res.status(200).send({
            message: "L'utente già esiste.",
            success: false
        })
     }
     else{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        const newUser = new candidateModel({
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          phone: req.body.phone,
          city: req.body.city,
          cv: req.body.cv,
          cvUrl: req.body.url,
          cvText: req.body.pdfText,
          coverLetter: req.body.coverLetter,
          degree: req.body.degree,
          password: hashedPassword,
          isAdmin: false,
        })
        await newUser.save()
        const token = jwt.sign({
          userid: newUser._id
      },process.env.JWT_SECRET,{})
        res.status(200).send({
            message: "User registered successfully.",
            success: true,
            data: {
              token: token, 
              user: newUser,
            },
        })
     }
   }
   catch(error){
      res.status(400).send({
        message: error.message,
        data: error,
        success: false
      })
   }
};

const getUserInfoCandidate = async(req,res) => {
  try{
     const user = await candidateModel.findOne({_id: req.body.userid})
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
   res.status(400).send({
       message: error.message,
       data: error,
       success: false
   })
  }
}
const loginCandidate = async(req,res) => {
  try{
    const user = await candidateModel.findOne({email: req.body.email})
    if (!user){
      res.status(200).send({
        message: "L'email non esiste",
        success: false
    })
    }
       const passwordsMatched = await bcrypt.compare(req.body.password,user.password)
       if(passwordsMatched){
           const token = jwt.sign({
               userid: user._id,
               type: 'user',
           },process.env.JWT_SECRET,{})
           res.send({
             message: "User logged in successfully",
             data: {
              token: token, 
              user: user,
            },
             success: true,
           })
       }
       else{
           res.status(200).send({
               message: "Password errata",
               success: false
           })
       }
    }
  catch(error){
   res.status(400).send({
       message: error.message,
       data: error,
       success: false
   })
  }
}

  module.exports = { getExamActiveById, getUserInfoById, registerCandidate, getUserInfoCandidate, loginCandidate }