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
    type: Object,
    require: true,
  },
});
const userLearningData = mongoose.model(
  "feedsUserLearingData",
  userLearningSchema,
);
module.exports = userLearningData;
