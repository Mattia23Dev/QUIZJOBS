const router = require("express").Router()
const {addExam, getAllExams, getExamById, editExam, deleteExam, addQuestionToExam, deleteQuestionFromExam, editQuestionInExam, saveTestProgress} = require("../controllers/examControllers")
const authMiddleware = require("../middlewares/authMiddleware")

router.post('/addExam',authMiddleware,addExam)
router.get('/getAllExams',authMiddleware,getAllExams)
router.get('/getExamById/:id',getExamById)
router.put('/editExam/:id',authMiddleware,editExam)
router.delete('/deleteExam/:id',authMiddleware,deleteExam)
router.post('/addQuestionToExam/:id',authMiddleware,addQuestionToExam)
router.delete('/deleteQuestionFromExam/:id',authMiddleware,deleteQuestionFromExam)
router.put('/editQuestionInExam/:id',authMiddleware,editQuestionInExam)
router.put('/save-test-progress', saveTestProgress);

module.exports = router;