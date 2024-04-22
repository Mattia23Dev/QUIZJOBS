const router = require("express").Router()
const { getExamActiveById, getUserInfoById, registerCandidate, getUserInfoCandidate, loginCandidate, addCandidateToTest, getCandidateWithPopulatedTests } = require("../controllers/candidateController");
const multer = require('multer');
const authMiddleware = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Genera un nome univoco per il file
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  });
  const upload = multer({ storage: storage });

router.get('/getExamActiveById/:id',getExamActiveById)
router.get('/getUserById/:id',getUserInfoById)
router.post('/registerCandidate', upload.any(), registerCandidate)
router.post('/loginCandidate', loginCandidate)
router.post('/get-user-info-candidate',authMiddleware,getUserInfoCandidate)
router.post('/addCandidateToTest',addCandidateToTest);
router.post('/getCandidateTestPopulate',getCandidateWithPopulatedTests);

module.exports = router;