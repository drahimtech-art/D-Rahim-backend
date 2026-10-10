const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AnalyticsDataSchema = new Schema({
  dateMonthYearDate: { type: String, required: true, default: Date.now },
  liveVistors: { type: Number, required: true },
  newUsers: { type: Number, required: true },
  pageViewed: { type: Number, required: true },
  bouncedBackUsers: { type: Number, required: true },
  returningUsers: { type: Number, required: true },
  deviceType: {
    desktop: { type: Number, required: true },
    mobile: { type: Number, required: true },
    tablet: { type: Number, required: true },
    other: { type: Number, required: true },
    type: {
      desktop: { type: Number, required: true },
      mobile: { type: Number, required: true },
      tablet: { type: Number, required: true },
      other: { type: Number, required: true },
    },
    required: true,
  },
  platformVisitedFrom: {
    facebook: { type: Number, required: true },
    linkedIn: { type: Number, required: true },
    youtub: { type: Number, required: true },
    tiktok: { type: Number, required: true },
    behance: { type: Number, required: true },
    instagram: { type: Number, required: true },
    twitter: { type: Number, required: true },
    google: { type: Number, required: true },
    pintrest: { type: Number, required: true },
    other: { type: Number, required: true },
    type: {
      facebook: { type: Number, required: true },
      linkedIn: { type: Number, required: true },
      youtub: { type: Number, required: true },
      tiktok: { type: Number, required: true },
      behance: { type: Number, required: true },
      instagram: { type: Number, required: true },
      twitter: { type: Number, required: true },
      google: { type: Number, required: true },
      pintrest: { type: Number, required: true },
      other: { type: Number, required: true },
    },
    required: true,
  },
});
AnalyticsDataSchema.index({ dateMonthYearDate: 1 });
const AnalyticsData = mongoose.model(
  "admin_analyticsData",
  AnalyticsDataSchema,
);
module.exports = AnalyticsData;
