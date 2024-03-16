const router =  require("express").Router()
const {addReport,getAllAttempts,getAllAttemptsByUser, reportOpenaiManual, reportOpenai} = require("../controllers/reportController")
const authMiddleware = require("../middlewares/authMiddleware")


router.post("/addReport",addReport)
router.post("/reportAiManual",reportOpenaiManual)
router.post("/reportAi",reportOpenai)
router.post("/getAllAttempts",authMiddleware,getAllAttempts)
router.get("/getAllAttemptsByUser",authMiddleware,getAllAttemptsByUser)


module.exports = router;