const candidateModel = require("../models/candidateModel")
const examModel = require("../models/examModel")
const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const openai = require('openai');
const apiKey = process.env.OPENAI_API;
const clientAi = new openai.OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
  model: 'gpt-4-turbo-preview',
});

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
       return
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
    return
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

const extractPdfAi = async (text, candidateId, testId, trackLink) => {
  try {
        const prompt = `
        Estrai informazioni importanti dal testo fornito seguendo questa scaletta:
        1. Lista delle 10 skills (abilità), hard skills o soft skills, o cose che ha svolto ma solo come competenza in lista:
        2. Educazione o istruzione, inserendo luogo di formazione, possibili voti (se forniti) e titoli di studio:
        3. Esperienze lavorative precedenti (solo esperienza, azienda in cui ha lavorato, anni da e quando, ruolo lavorativo);
      `;
        const requestData = {
           max_tokens: 1400, 
           n: 1,
           model: 'gpt-4-turbo-preview',
           messages: [
            { role: 'system', content: prompt},
            { role: 'user', content: text },
          ],
           temperature: 0.7,
           top_p: 1,
           frequency_penalty: 0,
           presence_penalty: 0,
           format: 'json'
         };
         const responseAI = await clientAi.chat.completions.create(requestData);
         const responses = responseAI.choices[0].message.content;
         const skillsRegex = /1\..+?((?=\n2\. )|(?=\n3\. )|$)/s;
         const educationRegex = /2\..+?((?=\n1\. )|(?=\n3\. )|$)/s;
         const workExperienceRegex = /3\..+?((?=\n1\. )|(?=\n2\. )|$)/s;
     
         const skillsMatch = responses.match(skillsRegex);
         const educationMatch = responses.match(educationRegex);
         const workExperienceMatch = responses.match(workExperienceRegex);
     
         const skills = skillsMatch ? skillsMatch[0] : '';
         const education = educationMatch ? educationMatch[0] : '';
         const workExperience = workExperienceMatch ? workExperienceMatch[0] : '';
         console.log('Skills:', skills);
         console.log('Education:', education);
         console.log('Work Experience:', workExperience);

         await examModel.findByIdAndUpdate(testId, {
          $push: {
            candidates: {
              candidate: candidateId,
              trackLink: trackLink,
              skills: skills,
              education: education,
              workExperience: workExperience
            }
          }
        });
        console.log('PDF data processed and saved successfully');
  } catch (error) {
      console.error('Error processing PDF data:', error);
  }
}

const addCandidateToTest = async(req, res) => {
  try {
      const { candidateId, testId, email } = req.body;
      console.log(req.body);

      const candidate = await candidateModel.findById(candidateId);
      const test = await examModel.findById(testId);
      if (!test){
        console.log("Il test non esiste")
        res.status(404).json({ message: 'Il test non esiste', success: false, data: null });
        return
      }
      if (!candidate) {
          console.log("Il candidato non esiste")
          res.status(404).json({ message: 'Il candidato non esiste', success: false, data: null });
          return
      } else {
          const existingTest = candidate.tests.find(test => test.testId.toString() === testId);
          if (!existingTest) {
              await candidateModel.findOneAndUpdate(
                  { email },
                  { $push: { tests: { testId, testName: test?.jobPosition } } },
                  { new: true }
              );
          }
          const updatedCandidate = await candidateModel.findOne({ email });
          const specificTest = updatedCandidate.tests.find(test => test.testId.toString() === testId);

          res.status(201).json({
              message: 'Candidate retrieved successfully',
              success: true,
              candidate: {
                  ...updatedCandidate.toObject(),
                  tests: specificTest ? [specificTest] : []
              }
          });
          if (!existingTest){
            extractPdfAi(candidate.cvText, candidate._id, testId, "SkillTest");
          }
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message, success: false });
  }
}

const getCandidateWithPopulatedTests = async  (req, res) => {
  try {
    const candidate = await candidateModel.findById(req.body.candidateId)
      .populate({
        path: 'tests.testId',
        model: 'exams',
        select: 'jobPosition skills jobCity jobContract jobTypeWork company jobDescription',
        populate: {
          path: 'company',
          model: 'users',
          select: 'companyName',
        }
      })
      .populate({
        path: 'tests.report',
        model: 'reports',
        select: 'result'
      });
    if (candidate) {
      console.log("Populated Candidate Tests:", candidate.tests);
      res.status(201).json({
        message: 'Test presi',
        success: true,
        data: candidate.tests,
    });
    } else {
      res.status(404).json({
        message: "Candidato non trovato",
        success: false,
        data: null,
      })
      return;
    }
  } catch (error) {
    console.error("Error fetching candidate with populated tests:", error);
    res.status(500).json({ message: error.message, success: false });
  }
}

  module.exports = { getExamActiveById, getCandidateWithPopulatedTests, addCandidateToTest, getUserInfoById, registerCandidate, getUserInfoCandidate, loginCandidate }