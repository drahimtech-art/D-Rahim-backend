const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connnectionSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  contactId: {
    type: String,
    required: true,
  },
  chatGroupId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
connnectionSchema.index({ userId: 1, contactId: -1 });
connnectionSchema.index({ contactId: 1 });
const userConnections = mongoose.model("userConnections", connnectionSchema);
module.exports = userConnections;
