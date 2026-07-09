const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    type: { type: String, required: true },
    imgUrl: { type: String, required: false },
    date: { type: String, required: true },
    time: { type: String, required: true },
    text: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);
const groupChatSchema = new Schema({
  groupId: {
    type: String,
    required: true,
  },
  messages: {
    type: [messageSchema],
    required: true,
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});
groupChatSchema.index({ groupId: 1, "messages.createdAt": 1 });
groupChatSchema.index({ groupId: 1 });
const connnectionMessageSchema = mongoose.model(
  "connectionMassages",
  groupChatSchema,
);
module.exports = connnectionMessageSchema;
