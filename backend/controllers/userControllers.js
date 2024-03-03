const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const examModel = require("../models/examModel");
const candidateModel = require("../models/candidateModel");
const fs = require('fs');
const path = require('path');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("830063440629-j40l5f7lb1fck6ap120s272d49rp1ph6.apps.googleusercontent.com");

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
            password: hashedPassword,
            partitaIva: req.body.partitaIva
        })
        await newUser.save()
        const token = jwt.sign({
          userid: newUser._id
      },process.env.JWT_SECRET,{})
        res.status(200).send({
            message: "User registered successfully.",
            success: true,
            data: token
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
            },process.env.JWT_SECRET,{})
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

  const changeStatusCandidate = async (req, res) => {
    try {
      const { userId, examId, newStatus } = req.body;
      console.log(req.body)
  
      // Trova l'esame dal suo id e popola i candidati
      const exam = await examModel.findOne({ _id: examId }).populate({
        path: 'candidates.candidate',
      });
  
      if (!exam) {
        return res.status(404).send({
          message: "Esame non trovato",
          data: null,
          success: false
        });
      }
  
      // Trova il candidato nell'array dei candidati
      const candidate = exam.candidates.find(c => c.candidate._id.toString() === userId);
  
      if (!candidate) {
        return res.status(404).send({
          message: "Candidato non trovato nell'esame",
          data: null,
          success: false
        });
      }
  
      // Cambia lo status del candidato
      candidate.status = newStatus;
  
      // Salva l'esame con lo status del candidato modificato
      await exam.save();
  
      return res.status(200).send({
        message: "Status del candidato modificato con successo",
        data: { userId, examId, newStatus },
        success: true
      });
    } catch (error) {
      return res.status(500).send({
        message: "Si è verificato un errore durante la modifica dello status del candidato",
        data: error.message,
        success: false
      });
    }
  };

 const addCandidate = async(req, res) => {
    try {
        const { name, surname, email, phone, city, coverLetter, degree, testId, testName, trackLink } = req.body;
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
                tests: [{ testId, testName }]
            });

            await newCandidate.save();
            const cvFileName = `cv_${newCandidate._id}.pdf`;
            const updatedCandidate = await candidateModel.findByIdAndUpdate(
              newCandidate._id,
              { cv: cvFileName },
              { new: true }
            );
            await examModel.findByIdAndUpdate(testId, { $push: { candidates: { candidate: newCandidate._id, trackLink: trackLink } } });
            const uploadFolderPath = path.resolve(__dirname, '..', 'uploads');
            const destinationPath = path.join(uploadFolderPath, cvFileName);
            fs.renameSync(cv, destinationPath);
            res.status(201).json({ message: 'Candidate added successfully', success: true, candidate: updatedCandidate });
        } else {
            const existingTest = candidate.tests.find(test => test.testId.toString() === testId);
            if (!existingTest) {
                await candidateModel.findOneAndUpdate(
                    { email },
                    { $push: { tests: { testId, testName } } }
                );
                await examModel.findByIdAndUpdate(testId, { $push: { candidates: { candidate: candidate._id, trackLink: trackLink } } });
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

const googleLogin = async (req, res) => {
  const {tokenId} = req.body;

  client.verifyIdToken({idToken: tokenId, audience: "830063440629-j40l5f7lb1fck6ap120s272d49rp1ph6.apps.googleusercontent.com"}).then((response) => {
    const {email_verified, name, email} = response.payload; 
    if (email_verified) {
      console.log('email verificata');
      User.findOne({email})
      .exec(async(err, user) => {
        if (err){
          console.log(err);
          return res.status(400).json({
            error: 'Qualcosa è andato storto..'
          })
        } else {
          if (user){
            const token = jwt.sign({
              userid: user._id
          },process.env.JWT_SECRET,{})
            res.send({
              message: "User logged in successfully",
              data: token,
              success: true,
            })
          } else {
              let password = email+process.env.JWT_SECRET;
              
              let newUser = new User({
                name,
                email,
                password: password,
              });

              await newUser.save((err, data) => {
                if (err) {
                  console.log(err);
                  return res.status(400).json({
                    error: 'Qualcosa è andato storto..'
                  })
                };
                
  
                const token = jwt.sign({
                  userid: newUser._id
              },process.env.JWT_SECRET,{})

                res.send({
                  message: "User logged in successfully",
                  data: token,
                  success: true,
                })
              })
          }
        }
      })
    }
    console.log(response.payload);
  })
};

module.exports = { register, login, getUserInfo, addCandidate, getCandidateInfo, googleLogin, changeStatusCandidate }