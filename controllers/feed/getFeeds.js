const express = require("express");
const mediaFeeds = express.Router();
const userLeaingData = require("../../modules/feeds/userLearningData/userLearningData.js");
const feedsPosts = require("../../modules/feeds/post.js");
const postLikes = require("../../modules/feeds/postLikes.js");
const postComments = require("../../modules/feeds/postComments.js");
const userData = require("../../modules/studentUser.js");
const { randomUUID } = require("crypto");
//middlewares
const apiRequstValidation = require("../../middlewares/apiValidation.js");
const validateUser = require("../../middlewares/userValidation.js");
//decay algorithim and states
const decayStats = require("./decayAlgorithim.js");
const userConnections = require("../../modules/userConnections.js");
//get post by user intreast
async function getPostByUserIntrest(userFeedsData, res) {
  try {
    const feedsList = [];
    const postIds = [];
    const userFeedsDataAnalisis = userFeedsData;
    const userConnectionId = userFeedsData.connectionId;
    const userMediaIntaraction = userFeedsData.mediaIntaractions;
    const hashTags = userMediaIntaraction.hashTags;
    const connectionsMedia = userMediaIntaraction.connectionsMedia;
    const globalConnectionsMedia = userMediaIntaraction.globalConnectionsMedia;
    // for hashTags
    const topHalfHashTagsOfUser = [];
    const orderTagsRate = [];
    //
    if (hashTags.length !== 0 && hashTags.length > 1) {
      const result = hashTags.sort((a, b) => {
        return b.rate - a.rate;
      });
      for (const tags of result) {
        orderTagsRate.push(tags);
      }
    } else if (hashTags.length !== 0) {
      for (const tags of hashTags) {
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
      //push to top halfhashTagsOf User
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
        })
        .sort({ createdAt: -1 })
        .limit(20)
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
      const feeds = await feedsPosts
        .find({ connectionId: { $in: topHalfConnectionsIds } })
        .sort({ createdAt: -1 })
        .limit(20)
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
      const feeds = await feedsPosts
        .find({ connectionId: { $in: topHalfConnectionsIds } })
        .sort({ createdAt: -1 })
        .limit(20)
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

mediaFeeds.get(
  "/content/:id",
  apiRequstValidation,
  validateUser,
  async (req, res) => {
    try {
      const connectionId = req.params.id;
      if (!connectionId)
        return res.status(400).json({
          ok: false,
          message: `invalide requst params connection id is required`,
        });
      const userId = "6a4a53e7e32a0f8e61531be8";
      const userFeedsData = await userLeaingData
        .find({
          userId: userId,
          connectionId: connectionId,
        })
        .lean();
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
          userFeedsData[0].mediaIntaractions.hashTags.length !== 0)
      ) {
        const data = await getPostByUserIntrest(userFeedsData[0], res);
        if (!data.pass) return;
        feedsList = data.feedsList;
        postIds = data.postIds;
        globalConnections = data.globalConnections;
        friendsConnections = data.friendsConnections;
        userConnectionId = data.userConnectionId;
      }
      //get global feeds
      const globalPostLimits = feedsList.length > 50 ? 150 : 200;
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
            if (feed._id) {
              feedsList.push(feed);
              postIds.push(feed.postId);
            }
          }
        }
      }
      let decayedFeedsList = [];
      const decayScoresPost = [];
      if (feedsList.length !== 0) {
        for (let i = 0; i < feedsList.length; i++) {
          const post = feedsList[i];
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
            const filtedListIds = [];
            const filtrdPostIds = [];
            let count = 0;
            for (const post of sortByScore) {
              if (count >= 100) break;
              const data = { ...post };
              delete data.totalScore;
              filtedList.push(data);
              filtedListIds.push(data.connectionId);
              filtrdPostIds.push(data.postId);
              count += 1;
            }
            //get author infor
            const getAuthorInfor = await userData
              .find(
                { connectionId: { $in: filtedListIds } },
                {
                  firstName: 1,
                  lastName: 1,
                  bio: 1,
                  imageUrl: 1,
                  connectionId: 1,
                  _id: 0,
                },
              )
              .lean();
            if (getAuthorInfor.length === 0)
              return res.status(404).json({
                ok: false,
                message: "somthing whent wrong post autors infor not gound",
              });
            //
            const orderedFeedsPost = []; // order array to be sent back
            // arrange authors infor with authors post in feeds
            const postWithAuthors = [];
            for (let i = 0; i < filtedList.length; i++) {
              for (let j = 0; j < getAuthorInfor.length; j++) {
                // comparing function
                if (
                  filtedList[i].connectionId === getAuthorInfor[j].connectionId
                ) {
                  const postData = { ...filtedList[i] };
                  const authorsInfo = { ...getAuthorInfor[j] };
                  delete postData.connectionId;
                  delete postData._id;
                  const olderPostInfo = {
                    ...authorsInfo,
                    ...postData,
                  };
                  postWithAuthors.push(olderPostInfo);
                  break;
                }
              }
            }
            //check if post was liked by user
            const allPostLikedByUser = await postLikes
              .find({
                postId: { $in: filtrdPostIds },
                connectionId: connectionId,
              })
              .lean();
            //get all top comments in post
            const allTopCommentsInPost = await postComments
              .find({ postId: { $in: filtrdPostIds }, depth: { $eq: 0 } })
              .sort({ likesCount: -1, createdAt: -1 })
              .lean();
            //order everthing together
            for (let p = 0; p < postWithAuthors.length; p++) {
              // top layer loop for post
              const post = postWithAuthors[p]; // post in post with authors
              let isPostLiked = false;
              const topPostComments = []; //for a single post all top comments list
              //
              for (let l = 0; l < allPostLikedByUser.length; l++) {
                // second loop to compare post with like docs if post was liked by user
                const likeDoc = allPostLikedByUser[l];
                if (likeDoc.postId === post.postId) {
                  // validate if post was liked
                  isPostLiked = true;
                  break; //validates if post was liked break early else check all true now since we have like to be false initaily we dont have to validate if it wasent liked its validated by default
                }
              }
              //
              for (let c = 0; c < allTopCommentsInPost.length; c++) {
                //c++ haha
                //third scope loop all comments and filter out all comments that belongs to post;
                const comment = allTopCommentsInPost[c];
                if (comment.postId === post.postId) {
                  // validate comments belongs to post and add to list this loops all through and filter out comments that belongs to post
                  topPostComments.push(comment);
                }
              }
              //add filted stats to post data
              const engamentStats = {
                isPostLiked: isPostLiked,
                topPostComments: topPostComments,
              };
              const orderedPostData = {
                ...post,
                ...engamentStats,
                listId: `${post.postId}/${randomUUID()}`,
              };
              //if all filters are done push to ordered list to be sent back to client
              orderedFeedsPost.push(orderedPostData);
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
            const shuffledFeeds = shuffle(orderedFeedsPost);
            decayedFeedsList = [...shuffledFeeds];
          }
        }
      }
      res
        .status(200)
        .json({ ok: true, message: "succesfull", feeds: decayedFeedsList });
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error ${error}` });
      console.log(error);
    }
  },
);
module.exports = mediaFeeds;
