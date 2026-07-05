const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
  author: {
    connectionId: {
      type: String,
      require: true,
    },
    type: Object,
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
    views: {
      type: Number,
      require: true,
    },
    type: Object,
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
  engamentStates: {
    likesId: {
      type: Array,
      require: true,
    },
    comments: {
      type: Array,
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
    type: Array,
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

const postData = mongoose.model("feedPost", postSchema);
module.exports = postData;
