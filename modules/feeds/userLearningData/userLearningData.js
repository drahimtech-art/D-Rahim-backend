const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userLearningSchema = new Schema({
  connectionId: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  mediaIntaractions: {
    hashTags: {
      type: [
        {
          tag: String,
          rate: Number,
        },
        { _id: false },
      ],
      require: true,
      default: [],
    },
    connectionsMedia: {
      type: [
        {
          connectionId: String,
          rate: Number,
        },
        { _id: false },
      ],
      require: true,
      default: [],
    },
    globalConnectionsMedia: {
      type: [
        {
          connectionId: String,
          rate: Number,
        },
        { _id: false },
      ],
      require: true,
    },
    type: {
      hashTags: {
        type: [
          {
            tag: String,
            rate: Number,
          },
        ],
        require: true,
      },
      connectionsMedia: {
        type: [
          {
            connectionId: String,
            rate: Number,
          },
        ],
        require: true,
      },
      globalConnectionsMedia: {
        type: [
          {
            connectionId: String,
            rate: Number,
          },
        ],
        require: true,
      },
    },
    require: true,
  },
  createdAt: { type: Date, require: true, default: Date.now },
});
userLearningSchema.index({ userId: 1, connectionId: 1 });
userLearningSchema.index({ connectionId: 1 });
const userLearningData = mongoose.model(
  "feedsUserLearingData",
  userLearningSchema,
);
module.exports = userLearningData;
