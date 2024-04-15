const Team = require("../models/teamModel");
const userModel = require("../models/userModel");

const createTeam = async (req, res) => {
    try {
        const { name, surname, email, password, role, company } = req.body;
        const existingTeamMember = await Team.findOne({email: email});
        if (existingTeamMember) {
            return res.status(400).json({
                message: 'Esiste già un membro del team con la stessa email.',
                success: false
            });
        }

        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Esiste già un utente con la stessa email.',
                success: false
            });
        }
        const user = await userModel.findById(company);
        if (!user){
            return res.status(400).json({
                message: 'Utente non trovato.',
                success: false
            });
        }
        const newMember = new Team({ name, surname, email, password, role, company });
        await newMember.save();
        user.team.push(newMember._id);
        await user.save();
        return res.status(200).json({ message: 'Dati utente aggiornati con successo', data: newMember, success: true });
    } catch (error) {
        console.error(error)
        res.send({
            message: error.message,
            data: error,
            success: false
        })
    }
  }

const deleteTeam = async (req, res) => {
    try {
      const userId = req.body.userId;
      const memberId = req.body.id;
      const member = await Team.findByIdAndDelete(memberId);
      if (!member) {
        return res.status(404).send();
      }
      const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Utente non trovato.',
                success: false
            });
        }

        user.team.pull(memberId);
        await user.save();
      res.status(200).json({ message: 'Dati utente aggiornati con successo', data: null, success: true });
    } catch (error) {
        console.error(error)
        res.send({
            message: error.message,
            data: error,
            success: false
        })
    }
  };
  
  const updateTeamMember = async (req, res) => {
    const memberId = req.params.id;
    const updates = req.body;
    const allowedUpdates = ['name', 'surname', 'email', 'password', 'role'];
    const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({
            message: "Invalid updates! Only name, surname, email, password, and role can be updated.",
            success: false
        });
    }

    try {
        const member = await Team.findById(memberId);
        if (!member) {
            return res.status(404).json({
                message: "Team member not found.",
                success: false
            });
        }

        Object.keys(updates).forEach(update => member[update] = updates[update]);
        await member.save();
        return res.status(200).json({
            message: 'Dati utente aggiornati con successo',
            data: member,
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
            data: error,
            success: false
        });
    }
}

const getTeam = async (req, res) => {
    try {
      const companyId = req.params.companyId;
      const teamMembers = await Team.find({ company: companyId });
      res.status(200).json({
        message: 'Team preso!',
        data: teamMembers,
        success: true
    });
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Errore nel recupero dei membri del team", error: error });
    }
  };

module.exports = {createTeam, deleteTeam, updateTeamMember, getTeam}