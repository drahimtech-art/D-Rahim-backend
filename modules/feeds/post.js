const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  connectionId: {
    type: String,
    require: true,
  },
  engament: {
    likes: {
      type: Number,
      require: true,
    },
    comments: {
      type: Number,
      require: true,
    },
    shares: {
      type: Number,
      require: true,
    },
    type: {
      likes: {
        type: Number,
        require: true,
      },
      comments: {
        type: Number,
        require: true,
      },
      shares: {
        type: Number,
        require: true,
      },
    },
    require: true,
  },
  content: {
    type: {
      type: String,
      require: true,
    },
    caption: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    type: Object,
    require: true,
  },
  postId: {
    type: String,
    require: true,
  },
  hashTages: {
    type: [String],
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
  createdAt: { type: Date, require: true, default: Date.now },
});
postSchema.index({ connectionId: 1, createdAt: -1 }); //query post for connections newset post
postSchema.index({ hashTages: 1, createdAt: -1 }); // query post for hashTags in new posts
postSchema.index({ engament: 1, createdAt: -1 }); // query post for top likes and newest
postSchema.index({ postId: 1 }); // query post for post
const postData = mongoose.model("feedPost", postSchema);
module.exports = postData;
