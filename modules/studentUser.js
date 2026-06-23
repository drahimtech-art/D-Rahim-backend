const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userShema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  connectionId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  role: {
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    type: Object,
    required: true,
  },
});

const studentInfor = mongoose.model("studentsInfo", userShema);
module.exports = studentInfor;
