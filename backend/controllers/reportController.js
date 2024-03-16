const Report = require("../models/reportModel")
const Exam = require("../models/examModel")
const User = require("../models/userModel");
const candidateModel = require("../models/candidateModel");
const examModel = require("../models/examModel");
const openai = require('openai');
const apiKey = process.env.OPENAI_API;

//add attempts
const client = new openai.OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    model: 'gpt-4-turbo-preview',
  });
const reportOpenaiManual = async (req,res) => {
    try {
        const {email, exam, questions, answers} = req.body;
          const prompt = `Immagina di essere uno specialista ed esperto nella psicologia e nella gestione delle risorse umane e devi dare una valutazione oggettiva del candidato, facendo un riassunto generale delle risposte date. Le risposte lunghe sono di domande aperte, mentre quelle più corte,
          sono di domande chiuse, questo è un test non focalizzato sulle competenze tecniche, quindi analizza semplicemente in base alle domande fornite l'attitudine del candidato oppure lo screening lavorativo. Ti fornirò un oggetto o array con le domande e lo stesso oggetto con le risposte, analizza le risposte, facendo un riassunto BREVE del candidato. Inserisci nell'analisi tutto ciò che può essere utile ad un'azienda 
          o ad un recruiter sapere di quel candidato.
          `;
          const exampleFormat = JSON.stringify({ questions, answers });
          const requestData = {
             max_tokens: 2600, 
             n: 2,
             model: 'gpt-4-turbo-preview',
             messages: [
                { role: 'system', content: prompt},
                { role: 'user', content: exampleFormat },
             ],
             stop: ['Domanda'],
             temperature: 0.7,
             top_p: 1,
             frequency_penalty: 0,
             presence_penalty: 0,
             format: 'json'
           };
           const responseAI = await client.chat.completions.create(requestData);
           console.log(responseAI.choices[0].message.content);
           const response = responseAI.choices[0].message.content;

           const candidate = await candidateModel.findOneAndUpdate(
            { email: email },
            { $set: { "tests.$[elem].summary": response } },
            { arrayFilters: [{ "elem.testId": exam }] }
        );

        res.send({
            message: "Cannot Fetch All Attempts.",
            data: null,
            success: false
        })

    } catch (error) {
        console.error(error)
        res.send({
            message: error.message,
            data: error,
            success: false
        })
    }
}
const reportOpenai = async (req,res) => {
    try {
        const {email, exam, questions, answers} = req.body;
        const examObj = examModel.findById(exam)
          const prompt = `Immagina di essere uno specialista ed esperto nella psicologia e nella gestione delle risorse umane e devi dare una valutazione oggettiva del candidato, facendo un riassunto generale delle risposte date. Le risposte di questo test sono tutte domanda chiuse,
          focalizzate sulle competenze tecniche, per tesatare queste competenze ${examObj.skills.join(', ')} per la posizione lavorativa ${examObj.jobPosition}. Ti fornirò un oggetto o array con le domande e lo stesso oggetto con le risposte, analizza le risposte, facendo un riassunto BREVE del candidato. Inserisci nell'analisi tutto ciò che può essere utile ad un'azienda 
          o ad un recruiter sapere di quel candidato.
          `;
          const exampleFormat = JSON.stringify({ questions, answers });
          const requestData = {
             max_tokens: 2600, 
             n: 2,
             model: 'gpt-4-turbo-preview',
             messages: [
                { role: 'system', content: prompt},
                { role: 'user', content: exampleFormat },
             ],
             stop: ['Domanda'],
             temperature: 0.7,
             top_p: 1,
             frequency_penalty: 0,
             presence_penalty: 0,
             format: 'json'
           };
           const responseAI = await client.chat.completions.create(requestData);
           console.log(responseAI.choices[0].message.content);
           const response = responseAI.choices[0].message.content;

           const candidate = await candidateModel.findOneAndUpdate(
            { email: email },
            { $set: { "tests.$[elem].summary": response } },
            { arrayFilters: [{ "elem.testId": exam }] }
        );

        res.send({
            message: "Cannot Fetch All Attempts.",
            data: null,
            success: false
        })

    } catch (error) {
        console.error(error)
        res.send({
            message: error.message,
            data: error,
            success: false
        })
    }
}

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


module.exports = {addReport,getAllAttempts, getAllAttemptsByUser, reportOpenai, reportOpenaiManual}
