const router = require("express").Router()
const { sendHelpEmail } = require("../controllers/emailControllers");
const {register, login, getUserInfo, addCandidate, getCandidateInfo, googleLogin, changeStatusCandidate, modifyUserData, getTeamInfo} = require("../controllers/userControllers")
const authMiddleware = require("../middlewares/authMiddleware")
const multer = require('multer')

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

router.post('/register',register)
router.post('/login',login)
router.post('/google-login',googleLogin)
router.post('/get-user-info',authMiddleware,getUserInfo)
router.post('/get-team-info',authMiddleware,getTeamInfo)
router.post('/get-candidate-info',authMiddleware,getCandidateInfo)
router.post('/add-candidate', upload.single('cv'), addCandidate)
router.post("/changeCandidateStatus",authMiddleware, changeStatusCandidate)
router.post("/sendHelpEmail",authMiddleware, sendHelpEmail)
router.post("/update/:userId",authMiddleware, modifyUserData)


module.exports = router