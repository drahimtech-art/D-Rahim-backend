const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const notificationSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
    isAction: { type: Boolean, required: true },
    url: { type: String, required: true },
    isViewed: { type: Boolean, required: true },
    notificationActionId: { type: String, required: true },
  },
  { timestamps: true },
);

notificationSchema.index({ createdAt: -1 });

const notificationsData = mongoose.model(
  "admin_notificationsData",
  notificationSchema,
);
module.exports = notificationsData;
