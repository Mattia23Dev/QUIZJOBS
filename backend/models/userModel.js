const mongoose = require("mongoose");
const Report = require("./reportModel");

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
    },
    lName: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    name: {
      type: String,
    },
    partitaIva: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: true,
    },
    type: {
      type: String,
      enum: ["company", "candidate"],
      default: "company",
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
    country: {
      type: String,
    },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
    tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "exams" }],
    companyDescription: {
      type: String,
    },
    companyCity: {
      type: String,
    },
    cvUrl: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    refreshGoogleToken: String,
    accessGoogleToken: String,
    experience: [
      {
        jobTitle: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        jobType: {
          type: String,
          enum: ["In sede", "Ibrido", "Da remoto"],
          default: "In sede",
          required: true,
        },
        startedDate: {
          type: Date,
          required: true,
        },
        endedDate: {
          type: Date,
        },
        isPresent: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Delete reports of the user when a user is deleted
userSchema.post("remove", async function (res, next) {
  await Report.deleteMany({ user: this._id });
  next();
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
