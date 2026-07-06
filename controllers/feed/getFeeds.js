const express = require("express");
const mediaFeeds = express.Router();
const userLeaingData = require("../../modules/feeds/userLearningData/userLearningData.js");
const feedsPosts = require("../../modules/feeds/post.js");
//middlewares
const apiRequstValidation = require("../../middlewares/apiValidation.js");
const userValdation = require("../../middlewares/userValidation.js");
//decay algorithim and states
const decayStats = require("./decayAlgorithim.js");
const userConnections = require("../../modules/userConnections.js.js");
//get post by user intreast
async function getPostByUserIntrest(userFeedsData, res) {
  try {
    const feedsList = [];
    const postIds = [];
    const userFeedsDataAnalisis = userFeedsData;
    const userConnectionId = userFeedsData.connectionId;
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
    // get post by hastags
    if (topHalfHashTagsOfUser.length !== 0) {
      const feeds = await feedsPosts
        .find({
          hashTages: { $in: topHalfHashTagsOfUser },
          createdAt: -1,
        })
        .limit(50)
        .lean();
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
          .limit(10)
          .lean();
        if (feeds.length !== 0) {
          for (const feed of feeds) {
            if (!postIds.includes(feed.postId)) {
              feedsList.push(feed);
              postIds.push(feed.postId);
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
          .limit(10)
          .lean();
        if (feeds.length !== 0) {
          for (const feed of feeds) {
            if (!postIds.includes(feed.postId)) {
              feedsList.push(feed);
              postIds.push(feed.postId);
            }
          }
        }
      }
    }
    const userIntreastList = {
      feedsList: [...feedsList],
      postIds: [...postIds],
      userConnectionId: userConnectionId,
      globalConnections: [...topHalfGlobalConnectionsIds],
      friendsConnections: [...topHalfConnectionsIds],
      pass: true,
    };
    return userIntreastList;
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error ${error}` });
    console.log(`server error ${error}`);
    const userIntreastList = {
      pass: false,
    };
    return userIntreastList;
  }
}

mediaFeeds.get("/content", async (req, res) => {
  try {
    const userId = "6a4a53e7e32a0f8e61531be8";
    const connectionId = "1fa6df25-5545-429b-94a5-dd6f3052d07c";
    const userFeedsData = await userLeaingData.find({
      userId: userId,
      connectionId: connectionId,
    });
    let feedsList = [];
    let postIds = [];
    let globalConnections = [];
    let friendsConnections = [];
    let userConnectionId;
    //get feeds by user intresst
    if (
      userFeedsData.length !== 0 &&
      (userFeedsData[0].mediaIntaractions.connectionsMedia.length !== 0 ||
        userFeedsData[0].mediaIntaractions.globalConnectionsMedia.length !==
          0 ||
        userFeedsData[0].mediaIntaractions.hashTages.length !== 0)
    ) {
      const data = await getPostByUserIntrest(userFeedsData, res);
      if (!data.pass) return;
      feedsList = [...feedsList, data.feedsList];
      postIds = [...feedsList, data.postIds];
      globalConnections = [...globalConnections, data.globalConnections];
      friendsConnections = [...friendsConnections, data.friendsConnections];
      userConnectionId = data.userConnectionId;
    }
    //get global feeds
    const globalPostLimits = feedsList.length > 100 ? 300 : 500;
    const TWO_WEEKS_AGO = new Date(new Date() - 14 * 24 * 60 * 60 * 1000);
    const THREE_DAYS_AGO = new Date(new Date() - 3 * 24 * 60 * 60 * 1000);
    const posts = await feedsPosts
      .find({
        $or: [
          {
            createdAt: { $gte: TWO_WEEKS_AGO },
          },
          {
            createdAt: { $gte: THREE_DAYS_AGO },
            "engament.likes": { $gte: 50 },
            "engament.shares": { $gte: 10 },
          },
        ],
      })
      .sort({ createdAt: -1 })
      .limit(globalPostLimits)
      .lean();
    const feeds = [...posts];
    if (feeds.length !== 0) {
      for (const feed of feeds) {
        if (!postIds.includes(feed.postId)) {
          feedsList.push(feed);
          postIds.push(feed.postId);
        }
      }
    }
    let decayedFeedsList = [];
    const decayScoresPost = [];
    if (feedsList.length !== 0) {
      for (const post of feedsList) {
        const score = await decayStats(
          post,
          globalConnections,
          friendsConnections,
          userConnectionId,
        );
        if (score) {
          decayScoresPost.push(score);
        }
      }
      if (decayScoresPost.length !== 0) {
        const sortByScore = decayScoresPost.sort((a, b) => {
          return b.totalScore - a.totalScore;
        });
        if (sortByScore.length !== 0) {
          const filtedList = [];
          let count = 0;
          for (const post of sortByScore) {
            if (count >= 200) break;
            const data = { ...post };
            delete data.totalScore;
            filtedList.push(data);
            count += 1;
          }
          // suffle result
          function shuffle(list) {
            const l = [...list];
            for (let i = l.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [l[i], l[j]] = [l[j], l[i]];
            }
            return l;
          }
          const shuffledFeeds = shuffle(filtedList);
          decayedFeedsList = [...shuffledFeeds];
        }
      }
    }
    res
      .status(200)
      .json({ ok: true, message: "succesfull", feeds: decayedFeedsList });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error ${error}` });
  }
});
module.exports = mediaFeeds;
