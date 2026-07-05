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
    hashTages: {
      type: Array,
      require: true,
    },
    connectionsMedia: {
      type: Array,
      require: true,
    },
    globalConnectionsMedia: {
      type: Array,
      require: true,
    },
    type: {
      hashTages: {
        type: Array,
        require: true,
      },
      connectionsMedia: {
        type: Array,
        require: true,
      },
      globalConnectionsMedia: {
        type: Array,
        require: true,
      },
    },
    require: true,
  },
});
userLearningSchema.index({ userId: 1, connectionId: -1 });
userLearningSchema.index({ connectionId: -1 });
const userLearningData = mongoose.model(
  "feedsUserLearingData",
  userLearningSchema,
);
module.exports = userLearningData;
