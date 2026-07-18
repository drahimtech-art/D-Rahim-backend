const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  connectionId: {
    type: String,
    required: true,
  },
  engament: {
    likes: {
      type: Number,
      required: true,
    },
    comments: {
      type: Number,
      required: true,
    },
    shares: {
      type: Number,
      required: true,
    },
    type: {
      likes: {
        type: Number,
        required: true,
      },
      comments: {
        type: Number,
        required: true,
      },
      shares: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  content: {
    type: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: Object,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  hashTages: {
    type: [String],
    required: true,
  },
  postedAt: { type: Date, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});
postSchema.index({ connectionId: 1, createdAt: -1 }); //query post for connections newset post
postSchema.index({ hashTages: 1, createdAt: -1 }); // query post for hashTags in new posts
postSchema.index({ engament: 1, createdAt: -1 }); // query post for top likes and newest
postSchema.index({ postId: 1 }); // query post for post
const postData = mongoose.model("feedPost", postSchema);
module.exports = postData;
