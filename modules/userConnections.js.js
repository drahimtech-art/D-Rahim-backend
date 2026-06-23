const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connnectionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  contactFirstName: {
    type: String,
    required: true,
  },
  contactLastName: {
    type: String,
    required: true,
  },
  contactId: {
    type: String,
    required: true,
  },
  contactImage: {
    type: String,
    required: false,
  },
});
const userConnections = mongoose.model("userConnections", connnectionSchema);
module.exports = userConnections;
