const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AnalyticsDataSchema = new Schema({
  dateMonthYearDate: { type: Date, required: true, default: Date.now },
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
      required: true,
    },
  },
  platformVisitedFrom: {
    facebook: { type: Boolean, required: true },
    linkedIn: { type: Boolean, required: true },
    youtub: { type: Boolean, required: true },
    tiktok: { type: Boolean, required: true },
    behance: { type: Boolean, required: true },
    instagram: { type: Boolean, required: true },
    twitter: { type: Boolean, required: true },
    google: { type: Boolean, required: true },
    pintrest: { type: Boolean, required: true },
    other: { type: Boolean, required: true },
    type: {
      facebook: { type: Boolean, required: true },
      linkedIn: { type: Boolean, required: true },
      youtub: { type: Boolean, required: true },
      tiktok: { type: Boolean, required: true },
      behance: { type: Boolean, required: true },
      instagram: { type: Boolean, required: true },
      twitter: { type: Boolean, required: true },
      google: { type: Boolean, required: true },
      pintrest: { type: Boolean, required: true },
      other: { type: Boolean, required: true },
    },
    required: true,
  },
});
AnalyticsDataSchema.index({ dateMonthYearDate: 1 });
const AnalyticsData = mongoose.model("admin_analyticsData");
module.exports = AnalyticsData;
