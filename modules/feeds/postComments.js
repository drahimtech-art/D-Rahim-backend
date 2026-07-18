const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentsSchema = new Schema({
  postId: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: false,
  },
  depth: {
    type: Number,
    required: true,
  },
  authorId: {
    type: String,
    required: false,
  },
  comment: {
    type: String,
    required: true,
  },
  likesCount: {
    type: Number,
    required: true,
  },
  dislikeCount: {
    type: Number,
    required: true,
  },
  replyCount: {
    type: Number,
    required: true,
  },
  commentedAt: { type: Date, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});
commentsSchema.index({ postId: 1, depth: 1, likesCount: 1, createdAt: -1 }); //query for top comments
commentsSchema.index({ postId: 1, createdAt: -1 }); // most recent query

const postComments = mongoose.model("postComments", commentsSchema);
module.exports = postComments;
