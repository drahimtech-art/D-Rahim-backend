const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookingServiceSchema = new Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    clientFullName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, required: true },
    aboutProject: { type: String, required: true },
    trafficSource: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true },
);
bookingServiceSchema.index({ createdAt: -1 });
const bookingServiceData = mongoose.model(
  "admin_bookings",
  bookingServiceSchema,
);
module.exports = bookingServiceData;
