const mongoose = require("mongoose")
const Report = require("./reportModel")

const userSchema = new mongoose.Schema({
   name: {
    type: String,
   },
   partitaIva: {
    type: String,
   },
   email: {
    type: String,
    required: true,
    unique: true
   },
   password: {
    type: String,
    required: true
   },
   isAdmin: {
    type: Boolean,
    required: true,
    default: true
   },
   profileImage: {
    type: String,
   },
   codeSdi: {
    type: String,
   },
   address: {
    type: String,
   },
   companyName: {
    type: String,
   },
   team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
   companyDescription: {
    type: String,
   },
   companyCity: {
    type: String,
   },
   refreshGoogleToken: String,
   accessGoogleToken: String,
},{
    timestamps: true
})

// Delete reports of the user when a user is deleted
userSchema.post('remove',async function(res, next){
    await Report.deleteMany({user: this._id});
    next();
})

const userModel = mongoose.model("users",userSchema)
module.exports = userModel