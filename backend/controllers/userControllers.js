const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const examModel = require("../models/examModel");
const candidateModel = require("../models/candidateModel");
const fs = require('fs');
const path = require('path');

//user registration
const register = async(req,res) => {
   try{
     // check if user already exists
     const userExists = await User.findOne({email: req.body.email})
     if(userExists){
        res.status(200).send({
            message: "User already exists.",
            success: false
        })
     }
     else{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()
        res.status(200).send({
            message: "User registered successfully.",
            success: true
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

//user login
const login = async(req,res) => {
   try{
     //check if user exists
     const user = await User.findOne({email: req.body.email})
     if(user){
        const passwordsMatched = await bcrypt.compare(req.body.password,user.password)
        //check if passwords are valid
        if(passwordsMatched){
            const token = jwt.sign({
                userid: user._id
            },process.env.JWT_SECRET,{
                expiresIn: "365d"
            })
            res.send({
              message: "User logged in successfully",
              data: token,
              success: true,
            })
        }
        else{
            res.status(200).send({
                message: "Invalid Password",
                success: false
            })
        }
     }
     else{
        res.status(200).send({
            message: "User doesnot exist.",
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

//get user info
const getUserInfo = async(req,res) => {
   try{
      const user = await User.findOne({_id: req.body.userid})
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

const getCandidateInfo = async (req, res) => {
    try {
      const { userId, examId } = req.body;
  
      const user = await candidateModel.findOne({ _id: userId }).populate({
        path: 'tests',
        match: { testId: examId },
        populate: { path: 'report' }
      });
  
      if (!user) {
        return res.status(404).send({
          message: "User not found",
          data: null,
          success: false
        });
      }
  
      return res.status(200).send({
        message: "User info fetched successfully",
        data: user,
        success: true
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        data: error,
        success: false
      });
    }
  };

 const addCandidate = async(req, res) => {
    try {
        const { name, surname, email, phone, city, coverLetter, degree, testId } = req.body;
        console.log(req.body);
        const cv = req.file.path; 

        const candidate = await candidateModel.findOne({ email });

        if (!candidate) {
            const newCandidate = new candidateModel({
                name,
                surname,
                email,
                phone,
                city,
                cv,
                coverLetter,
                degree,
                tests: [{ testId }]
            });

            await newCandidate.save();
            const cvFileName = `cv_${newCandidate._id}.pdf`;
            const updatedCandidate = await candidateModel.findByIdAndUpdate(
              newCandidate._id,
              { cv: cvFileName },
              { new: true }
            );
            await examModel.findByIdAndUpdate(testId, { $push: { candidates: { candidate: newCandidate._id } } });
            const uploadFolderPath = path.resolve(__dirname, '..', 'uploads');
            const destinationPath = path.join(uploadFolderPath, cvFileName);
            fs.renameSync(cv, destinationPath);
            res.status(201).json({ message: 'Candidate added successfully', success: true, candidate: updatedCandidate });
        } else {
            const existingTest = candidate.tests.find(test => test.testId.toString() === testId);
            if (!existingTest) {
                await candidateModel.findOneAndUpdate(
                    { email },
                    { $push: { tests: { testId } } }
                );
                await examModel.findByIdAndUpdate(testId, { $push: { candidates: { candidate: candidate._id } } });
            }
            const updatedCandidate = await candidateModel.findOneAndUpdate(
                { email },
                { $pull: { tests: { testId: { $ne: testId } } } }, // Rimuovi tutti i test che non corrispondono all'ID desiderato
                { new: true } // Restituisci il nuovo documento aggiornato
            );
            res.status(201).json({ message: 'Candidate added successfully', success: true, candidate: updatedCandidate });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, success: false });
    }
}

module.exports = { register, login, getUserInfo, addCandidate, getCandidateInfo }