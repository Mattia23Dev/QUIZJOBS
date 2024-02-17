const router = require("express").Router()
const {register, login, getUserInfo, addCandidate} = require("../controllers/userControllers")
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
router.post('/get-user-info',authMiddleware,getUserInfo)
router.post('/add-candidate', upload.single('cv'), addCandidate);


module.exports = router