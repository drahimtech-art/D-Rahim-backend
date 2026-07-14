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
  engamentStates: {
    likesId: {
      type: Array,
      require: true,
    },
    comments: {
      type: Array,
      require: true,
    },
    type: {
      likesId: {
        type: Array,
        require: true,
      },
      comments: {
        type: [
          {
            connectionId: {
              type: String,
              require: true,
            },
            comment: {
              type: String,
              require: true,
            },
            likes: {
              type: Number,
              require: true,
            },
            disLikes: {
              type: Number,
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
            createdAt: {
              type: Date,
              require: true,
              default: Date.now,
            },
            subComments: {
              type: [
                {
                  connectionId: {
                    type: String,
                    require: true,
                  },
                  comment: {
                    type: String,
                    require: true,
                  },
                  likes: {
                    type: Number,
                    require: true,
                  },
                  disLikes: {
                    type: Number,
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
                  createdAt: {
                    type: Date,
                    require: true,
                    default: Date.now,
                  },
                  subComments: {
                    type: Array,
                    require: true,
                    default: [],
                  },
                },
              ],
              require: true,
              default: [],
            },
          },
        ],
        require: true,
        default: [],
      },
    },
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
postSchema.index({ connectionId: 1, postId: 1, createdAt: -1 });
postSchema.index({ hashTages: 1, createdAt: -1 });
postSchema.index({ engament: 1, createdAt: -1 });
postSchema.index({ postId: 1 });
const postData = mongoose.model("feedPost", postSchema);
module.exports = postData;
