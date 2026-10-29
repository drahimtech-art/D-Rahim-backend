const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const emailWorkerSchema = new Schema(
  {
    workType: { type: String, required: true },
    email: { type: String, required: true },
    isJobDone: { type: Boolean, required: true },
    jobDocId: { type: String, required: true },
  },
  { timestamps: true },
);

emailWorkerSchema.index({ createdAt: -1 });
emailWorkerSchema.index({ isJobDone: 1 });

const emailWorkerData = mongoose.model(
  "admin_jobWorker_emailWorker",
  emailWorkerSchema,
);
module.exports = emailWorkerData;
