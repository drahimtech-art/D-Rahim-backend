const express = require("express");
const mediaFeeds = express.Router();
const userLeaingData = require("../../modules/feeds/userLearningData/userLearningData");
const postData = require("../../modules/feeds/post");
//middlewares
const apiRequstValidation = require("../../middlewares/apiValidation.js");
const userValdation = require("../../middlewares/userValidation.js");

module.exports = mediaFeeds;
