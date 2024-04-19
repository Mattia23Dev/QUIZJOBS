const router = require("express").Router()
const { getExamActiveById, getUserInfoById } = require("../controllers/candidateController");

router.get('/getExamActiveById/:id',getExamActiveById)
router.get('/getUserById/:id',getUserInfoById)

module.exports = router;