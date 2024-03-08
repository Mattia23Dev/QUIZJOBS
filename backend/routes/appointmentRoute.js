const router = require("express").Router()
const { saveAppointment, getAppointmentUser, updateAppointment, deleteAppointment } = require("../controllers/appointmentController");
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/addAppointment",authMiddleware,saveAppointment)
router.post("/updateAppointment/:appointmentId",authMiddleware,updateAppointment)
router.get('/appointments/:companyId', authMiddleware, getAppointmentUser)
router.post('/deleteAppointment/:appointmentId', authMiddleware, deleteAppointment)

module.exports = router;