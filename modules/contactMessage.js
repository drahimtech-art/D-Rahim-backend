const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  connectionId: {
    type: String,
    required: true,
  },
  contactId: {
    type: String,
    required: true,
  },
  messages: {
    from: { type: String, required: true },
    to: { type: String, required: true },
    type: { type: String, required: true },
    imgUrl: { type: String, required: false },
    date: { type: String, required: true },
    time: { type: String, required: true },
    text: { type: String, required: false },
  },
  createdAt: { type: Date, default: Date.now },
});
messageSchema.index({ connectionId: 1, contactId: 1, createdAt: -1 });
const connnectionMessageSchema = mongoose.model(
  "connectionMassages",
  messageSchema,
);
module.exports = connnectionMessageSchema;
