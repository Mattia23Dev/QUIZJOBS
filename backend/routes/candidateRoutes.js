const router = require("express").Router()
const { getExamActiveById } = require("../controllers/candidateController");

router.get('/getExamActiveById/:id',getExamActiveById)

module.exports = router;