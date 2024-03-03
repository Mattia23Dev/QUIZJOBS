const Exam = require("../models/examModel")
const User = require("../models/userModel")
const Question = require('../models/questionModel');
const candidateModel = require("../models/candidateModel");

const addExam = async (req, res) => {
  try {
      const user = await User.findOne({
          _id: req.body.userId
      });

      if (user.isAdmin) {

        const examWithIdExists = await Exam.findOne({ idEsame: req.body.idEsame });
          if (examWithIdExists) {
              return res.send({
                  message: "Exam with the same ID already exists",
                  success: false
              });
          }

          const newExam = new Exam(req.body);
          const jobPositionSlug = req.body.jobPosition.toLowerCase().replace(/\s/g, '_'); 
          const examLink = `http://localhost:3000/user/${jobPositionSlug}/${newExam._id}`;
          newExam.examLink = examLink;
          newExam.company = req.body.userId;
          console.log(req.body);
          if (req.body.domande && req.body.domande.length > 0) {
            const savedQuestions = [];
              for (const domanda of req.body.domande) {
                const newQuestion = new Question({
                    question: domanda.domanda,
                    correctOption: domanda.rispostaCorretta !== null ?
                      domanda.rispostaCorretta.lettera + ' ' + domanda.rispostaCorretta.risposta
                      : "Nullo",
                    options: domanda.opzioni,
                    exam: newExam._id,
                });
                const savedQuestion = await newQuestion.save();
                savedQuestions.push(savedQuestion);
            }
            newExam.questions = savedQuestions;
          }

          await newExam.save();
          res.send({
              message: "Exam added successfully",
              success: true,
              data: newExam,
          });
      }
  } catch (error) {
      res.send({
          message: error.message,
          data: error,
          success: false
      });
  }
};

const getAllExams = async(req,res) => {
  try{
     const exam = await Exam.find()
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

const getExamById = async(req,res) => {
  try{
     const exam = await Exam.find({_id: req.params.id})
      .populate({
          path: "candidates.candidate",
          select: "name surname email phone city cv", // Seleziona i campi desiderati per il candidato
      })
      .populate({
          path: "candidates.report",
          select: "result", // Seleziona i campi desiderati per il report
      });
     if(exam){
      res.send({
        message: "Exam data fetched successfully.",
        data: exam,
        success: true
      })
     }
     else{
      res.send({
        message: "Exam doesnot exists.",
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

const getCandidateCrm = async (req, res) => {
  try {
      const userId = req.params.id;
      const exams = await Exam.find({ company: userId })
          .populate({
              path: 'candidates.candidate',
              select: 'name surname status tests createdAt',
          })
          .populate({
              path: 'candidates.report',
              select: 'result',
          });

      if (!exams || exams.length === 0) {
          return res.status(404).json({
              message: 'No exams found for the user.',
              data: null,
              success: false,
          });
      }
      let candidates = [];

      for (const exam of exams) {
          const candidatesForExam = await candidateModel.find({
              'tests.testId': { $in: exam._id}
          });
          if (exam.candidates && exam.candidates.length > 0){
          const formattedCandidates = candidatesForExam.map(candidate => {
            const examCandidate = exam.candidates.find(c => c.candidate._id.toString() === candidate._id.toString());
            console.log(examCandidate.status)
              return {
                  examId: exam._id,
                  tests: candidate.tests,
                  jobPosition: exam.jobPosition,
                  createdAt: candidate.createdAt,
                  candidateId: candidate._id,
                  name: candidate.name,
                  surname: candidate.surname,
                  email: candidate.email,
                  phone: candidate.phone,
                  city: candidate.city,
                  status: examCandidate.status,
                  cv: candidate.cv,
                  report: examCandidate.report,
              };              
        });
          candidates = [...candidates, ...formattedCandidates];
        }
      }

      res.status(200).json({
          message: 'Exams data fetched successfully.',
          data: candidates,
          success: true,
      });
  } catch (error) {
      res.status(500).json({
          message: error.message,
          data: error,
          success: false,
      });
  }
};

const editExam = async(req,res) => {
  try{
     const user = await User.findOne({_id: req.body.userid})
     if(user.isAdmin){
      const exam = await Exam.findOne({_id: req.params.id})
      if(exam){
        exam.name = req.body.name;
        exam.duration = req.body.duration;
        exam.category = req.body.category;
        exam.totalMarks = req.body.totalMarks;
        exam.passingMarks = req.body.passingMarks;
        exam.save()
        res.send({
          message: "Exam details edited successfully.",
          data: exam,
          success: true
        })
      }
      else{
        res.send({
          message: "Exam doesn't exists.",
          data: null,
          success: false
        })
      }
     }
     else{
      res.send({
        message: "Cannot Update Exam Details.",
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

const deleteExam = async(req,res) => {
  try{
     const user = await User.findOne({_id: req.body.userid})
     if(user.isAdmin){
      const exam = await Exam.findOne({_id: req.params.id})
      if(exam){
        exam.delete()
        res.send({
          message: "Selected exam deleted successfully.",
          data: null,
          success: true
        })
      }
      else{
        res.send({
          message: "Exam doesn't exists.",
          data: null,
          success: false
        })
      }
     }
     else{
      res.send({
        message: "Cannot Delete Exam.",
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

const addQuestionToExam = async(req,res) => {
   try{
     const user = await User.findById(req.body.userid)
     if(user.isAdmin){
        // add question to Questions Collection
        const newQuestion = new Question(req.body)
        const question = await newQuestion.save()
        // add question to exam
        const exam = await Exam.findOne({_id: req.params.id})
        exam.questions.push(question._id);
        await exam.save();
        res.send({
          message: "Question added successfully.",
          data: null,
          success: true
        })
      }
      else{
        res.send({
          message: "Question cannot be added.",
          data: null,
          success: false
        })
      }
   }
   catch(error){
       console.log(error.message)
       res.send({
        message: error.message,
        data: error,
        success: false
       })
   }
}

const editQuestionInExam = async(req,res) => {
  try{ 
    const user = await User.findById(req.body.userid)
    if(user.isAdmin){
       await Question.findByIdAndUpdate(req.body.questionId, req.body);
       res.send({
        message: "Question edited successfully",
        success: true
       })
    }
    else{
      res.send({
        message: "Question cannot be edited.",
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

const deleteQuestionFromExam = async(req,res) => {
  try{ 
    const user = await User.findById(req.body.userid)
    if(user.isAdmin){
      // delete question from the questions collection 
      const question = await Question.findOne({ _id: req.body.questionId});
      await question.delete()
      // delete question in exam
      const exam = await Exam.findOne({_id: req.params.id})
      const questions = exam.questions
      exam.questions = questions.filter((question)=>{
        if(question._id!=req.body.questionId){
          return question._id!=req.body.questionId
        }
      })
      await exam.save()
       res.send({
        message: "Selected question deleted successfully",
        success: true
       })
    }
    else{
      res.send({
        message: "Question cannot be deleted.",
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

const saveTestProgress = async (req, res) => {
  try {
    const { email, testId, questionIndex, selectedOption, arrayAnswers, correctAnswer, totalQuestions } = req.body;

    const candidate = await candidateModel.findOne({ email });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found', success: false });
    }

    const testIndex = candidate.tests.find(test => test.testId.toString() === testId);

    if (!testIndex) {
      return res.status(404).json({ message: 'Test not found for the candidate', success: false });
    }

    testIndex.progress = { questionIndex, selectedOption };
    
    testIndex.correctAnswers = correctAnswer;
    testIndex.totalQuestions = totalQuestions;
    testIndex.arrayAnswers = arrayAnswers; 

    await candidate.save();

    const updatedCandidate = await candidateModel.findOneAndUpdate(
      { email },
      { $pull: { tests: { testId: { $ne: testId } } } },
      { new: true } 
  );

    res.status(200).json({ message: 'Test progress saved successfully', success: true, candidate: updatedCandidate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const getAllExamsByUser = async(req,res) => {
  try{
     const exam = await Exam.find({company: req.params.id})
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

const addTrackLink = async (req, res) => {
  const { nome, examId } = req.body;

  try {
      const esame = await Exam.findById(examId);

      if (!esame) {
          return res.status(404).json({ message: 'Esame non trovato' });
      }
      esame.trackLink.push(nome);
      await esame.save();

      res.status(200).json({ message: 'Nome aggiunto con successo alla lista trackLink dell\'esame', data: esame.trackLink, success: true });
  } catch (error) {
      console.error('Errore durante l\'aggiunta del nome alla lista trackLink:', error);
      res.status(500).json({ message: 'Si è verificato un errore durante l\'aggiunta del nome alla lista trackLink', error: error });
  }
};

const deleteTrackLink = async (req, res) => {
  const { nome, examId } = req.body;

  try {
      const esame = await Exam.findById(examId);

      if (!esame) {
          return res.status(404).json({ message: 'Esame non trovato' });
      }

      const index = esame.trackLink.indexOf(nome);
      if (index === -1) {
          return res.status(404).json({ message: 'Nome non trovato nella lista trackLink dell\'esame' });
      }

      esame.trackLink.splice(index, 1);
      await esame.save();

      res.status(200).json({ message: 'Nome eliminato con successo dalla lista trackLink dell\'esame', data: esame.trackLink, success: true });
  } catch (error) {
      console.error('Errore durante l\'eliminazione del nome dalla lista trackLink:', error);
      res.status(500).json({ message: 'Si è verificato un errore durante l\'eliminazione del nome dalla lista trackLink', error: error });
  }
};

module.exports = {addExam, getAllExams, getAllExamsByUser, getExamById, 
  getCandidateCrm, editExam, deleteExam, addQuestionToExam, editQuestionInExam, 
  deleteQuestionFromExam, saveTestProgress, addTrackLink, deleteTrackLink}
