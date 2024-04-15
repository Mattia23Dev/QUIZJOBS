const router =  require("express").Router()
const { createTeam, deleteTeam, updateTeamMember, getTeam } = require("../controllers/teamControllers");
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/createTeam",authMiddleware,createTeam)
router.post("/deleteTeam",authMiddleware,deleteTeam)
router.post("/updateTeam/:id",authMiddleware,updateTeamMember)
router.get("/getTeam/:companyId",authMiddleware,getTeam)

module.exports = router;