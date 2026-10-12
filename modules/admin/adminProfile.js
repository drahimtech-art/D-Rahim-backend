const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminProfileSchema = new Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  about: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});
adminProfileSchema.index({ email: 1 });
const adminProfileData = mongoose.model("admin_login", adminProfileSchema);
module.exports = adminProfileData;
