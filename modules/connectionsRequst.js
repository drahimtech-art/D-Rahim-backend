const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const connectionsRequstSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  connectionId: {
    type: String,
    required: true,
  },
  requstList: {
    type: [
      {
        contactId: {
          type: String,
          required: true,
        },
        chatGroupId: {
          type: String,
          required: true,
        },
        invite: {
          type: Boolean,
          required: true,
        },
        isConnected: {
          type: Boolean,
          required: true,
        },
        createdAt: { type: Date, required: true, default: Date.now },
      },
    ],
    required: true,
    default: [],
  },
  createdAt: { type: Date, required: true, default: Date.now },
});
connectionsRequstSchema.index({ userId: 1, connectionId: 1 });
const connectionsRequst = mongoose.model(
  "connectionsRequst",
  connectionsRequstSchema,
);
module.exports = connectionsRequst;
