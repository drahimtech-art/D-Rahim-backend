const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const likesSchema = new Schema({
  postId: {
    type: String,
    required: true,
  },
  connectionId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
likesSchema.index({ postId: 1, connectionId: 1 }); // query for if user liked post
const postLikes = mongoose.model("postLikes", likesSchema);
module.exports = postLikes;
