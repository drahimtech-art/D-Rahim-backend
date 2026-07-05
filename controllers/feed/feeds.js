const express = require("express");
const mediaFeeds = express.Router();
const userLeaingData = require("../../modules/feeds/userLearningData/userLearningData");
const feedsPosts = require("../../modules/feeds/post");
//middlewares
const apiRequstValidation = require("../../middlewares/apiValidation.js");
const userValdation = require("../../middlewares/userValidation.js");

//get post by user intreast
async function getPostByUserIntrest(userFeedsData, res) {
  try {
    const feedsList = [];
    const postIds = [];
    const userFeedsDataAnalisis = userFeedsData;
    const userMediaIntaraction = userFeedsData.mediaIntaractions;
    const hashTages = userMediaIntaraction.hashTages;
    const connectionsMedia = userMediaIntaraction.connectionsMedia;
    const globalConnectionsMedia = userMediaIntaraction.globalConnectionsMedia;
    // for HashTages
    const topHalfHashTagsOfUser = [];
    const orderTagsRate = [];
    //
    if (hashTages.length !== 0 && hashTages.length > 1) {
      const result = hashTages.sort((a, b) => {
        return b.rate - a.rate;
      });
      for (const tags of result) {
        orderTagsRate.push(tags);
      }
    } else if (hashTages.length !== 0) {
      for (const tags of hashTages) {
        orderTagsRate.push(tags);
      }
    }
    //
    if (orderTagsRate.length > 10) {
      let totalHalf = 0;
      const half = (orderTagsRate.length / 2).toString().split(".");
      if (half.length > 1) {
        totalHalf = Number(half[0]);
      } else {
        totalHalf = Number(half);
      }
      //push to top halfHashTagesOf User
      for (let i = 0; i < totalHalf; i++) {
        topHalfHashTagsOfUser.push(orderTagsRate[i].tag);
      }
    } else if (orderTagsRate.length !== 0) {
      for (const tages of orderTagsRate) {
        topHalfHashTagsOfUser.push(tages.tag);
      }
    }
    // get post bay hastags
    if (topHalfHashTagsOfUser.length !== 0) {
      const feeds = await feedsPosts
        .find({
          hashTages: { $in: topHalfHashTagsOfUser },
          createdAt: -1,
        })
        .limit(50);
      if (feeds.length !== 0) {
        for (const feed of feeds) {
          if (!postId.includes(feed.postId)) {
            feedsList.push(feed);
            postIds.push(feed.postId);
          }
        }
      }
    }
    //get post by users connections
    const topHalfConnectionsIds = [];
    const orderConnectionsRate = [];
    //
    if (connectionsMedia.length !== 0 && connectionsMedia.length > 1) {
      const conncetionsRateResult = [];
      const result = connectionsMedia.sort((a, b) => {
        return b.rate - a.rate;
      });
      for (const rate of result) {
        orderConnectionsRate.push(rate);
      }
    } else {
      for (const rate of connectionsMedia) {
        orderConnectionsRate.push(rate);
      }
    }
    //
    if (orderConnectionsRate.length > 10) {
      let totalHalf = 0;
      const half = (orderConnectionsRate.length / 2).toString().split(".");
      if (half.length > 1) {
        totalHalf = Number(half[0]);
      } else {
        totalHalf = Number(half);
      }
      //push to topHalfConnectionsIds of User
      for (let i = 0; i < totalHalf; i++) {
        topHalfConnectionsIds.push(orderConnectionsRate[i].tag);
      }
    } else if (orderConnectionsRate.length !== 0) {
      for (const connections of orderConnectionsRate) {
        topHalfConnectionsIds.push(connections);
      }
    }
    //
    if (topHalfConnectionsIds.length != 0) {
      for (const connection of topHalfConnectionsIds) {
        const feeds = await feedsPosts
          .find({ connectionId: connection, createdAt: -1 })
          .limit(5);
        if (feeds.length !== 0) {
          for (const feed of feeds) {
            if (!postIds.includes(feed.postId)) {
              feedsList.push(feed);
              postIds.push(feed.postId);
              break;
            }
          }
        }
      }
    }
    //get post by user glopalConnectionsMedia
    const topHalfGlobalConnectionsIds = [];
    const orderGlobalConnectionsRate = [];
    //
    if (
      globalConnectionsMedia.length !== 0 &&
      globalConnectionsMedia.length > 1
    ) {
      const conncetionsRateResult = [];
      const result = globalConnectionsMedia.sort((a, b) => {
        return b.rate - a.rate;
      });
      for (const rate of result) {
        orderGlobalConnectionsRate.push(rate);
      }
    } else {
      for (const rate of globalConnectionsMedia) {
        orderGlobalConnectionsRate.push(rate);
      }
    }
    //
    if (orderGlobalConnectionsRate.length > 10) {
      let totalHalf = 0;
      const half = (orderGlobalConnectionsRate.length / 2)
        .toString()
        .split(".");
      if (half.length > 1) {
        totalHalf = Number(half[0]);
      } else {
        totalHalf = Number(half);
      }
      //push to topHalfConnectionsIds of User
      for (let i = 0; i < totalHalf; i++) {
        topHalfGlobalConnectionsIds.push(orderGlobalConnectionsRate[i].tag);
      }
    } else if (orderGlobalConnectionsRate.length !== 0) {
      for (const connections of orderGlobalConnectionsRate) {
        topHalfGlobalConnectionsIds.push(connections);
      }
    }
    //
    if (topHalfGlobalConnectionsIds.length != 0) {
      for (const connection of topHalfGlobalConnectionsIds) {
        const feeds = await feedsPosts
          .find({ connectionId: connection, createdAt: -1 })
          .limit(30);
        if (feeds.length !== 0) {
          for (const feed of feeds) {
            if (!postIds.includes(feed.postId)) {
              feedsList.push(feed);
              postIds.push(feed.postId);
              break;
            }
          }
        }
      }
    }
    const userIntreastList = {
      feedsList: feedsList,
      postIds: postIds,
    };
    return userIntreastList;
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error ${error}` });
  }
}

mediaFeeds.get("/post/content", async (req, res) => {
  try {
    const userId = req.body.userId;
    const connectionId = req.body.connectionId;
    const userFeedsData = await userLeaingData.find({
      userId: userId,
      connectionId: connectionId,
    });
    const feedsList = [];
    const postIds = [];
    //

    //console.log(topHalfConnectionsIds);
    //console.log(topHalfGlobalConnectionsIds);
    // console.log(orderTagsRate);
    //console.log(topHalfHashTagsOfUser);
    //console.log(feedsList);
    //get decay score
    const decayedFeedsList = [];
    const decayScoresPost = [];
    for (const post of feedsList) {
      const score = decayStats(post);
      decayScoresPost.push(score);
    }
    const sortByScore = decayScoresPost.sort((a, b) => {
      return b.totalScore - a.totalScore;
    });
    console.log(sortByScore);
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error ${error}` });
  }
});
module.exports = mediaFeeds;
