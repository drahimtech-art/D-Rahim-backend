const express = require("express");
const feedsIntaraction = express.Router();
const feedsPost = require("../../modules/feeds/post.js");
const userLearningData = require("../../modules/feeds/userLearningData/userLearningData.js");
const userConnections = require("../../modules/userConnections.js");
//middlewares
const apiRequstValidation = require("../../middlewares/apiValidation.js");
const validateUser = require("../../middlewares/userValidation.js");
//
/*
(async () => {
  const createUserdata = new userLearningData({
    connectionId: "1ed0d6e0-267d-4e53-a000-77a637de42d5",
    userId: "6a39d2a17f20f881079fe879",
    mediaIntaractions: {
      hashTages: [],
      connectionsMedia: [],
      globalConnectionsMedia: [],
      createdAt: new Date(),
    },
  });
  const saveData = await createUserdata.save();
  console.log(saveData);
})();
*/
//
feedsIntaraction.put(
  "/like/post/:id",
  apiRequstValidation,
  validateUser,
  async (req, res) => {
    try {
      const userId = res.tokenId;
      const postId = req.params.id;
      const userConnectionId = req.body.connectionId;
      if (!postId)
        return res
          .status(400)
          .json({ ok: false, message: "invalide requst post id is required" });
      if (!userConnectionId)
        return res.status(400).json({
          ok: false,
          message: "invalide requst connection id is required",
        });
      //get post
      const post = await feedsPost.find({ postId: postId }).lean();
      if (post.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: `no post with the given id found` });
      const userMediaIntrest = await userLearningData.find({
        userId: userId,
        connectionId: userConnectionId,
      });
      if (userMediaIntrest.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: "user feeds media doc not found" });
      //
      const postTotalLikesId = post[0].engamentStates.likesId;
      const isPostLIkedAlreadyByUser = postTotalLikesId.includes(
        userConnectionId,
      )
        ? true
        : false;
      if (isPostLIkedAlreadyByUser)
        return res
          .status(200)
          .json({ ok: true, message: "post already liked by user" });
      const authorId = post[0].connectionId;
      const postHashTages = post[0].hashTages;
      const postTotalLikes = isPostLIkedAlreadyByUser
        ? post[0].engament.likes
        : post[0].engament.likes + 1;
      const updatedPostTotalLikesId = isPostLIkedAlreadyByUser
        ? [...postTotalLikesId]
        : [...postTotalLikesId, userConnectionId];
      const engaments = {
        likes: postTotalLikes,
        comments: post[0].engament.comments,
        shares: post[0].shares,
      };
      const engamentStates = {
        likesId: updatedPostTotalLikesId,
        comments: post[0].engamentStates.comments,
      };
      //update authors post with likes added
      const updatePost = await feedsPost.findOneAndUpdate(
        { postId: postId },
        { engament: engaments, engamentStates: engamentStates },
      );
      if (updatePost) {
        //end of authors and response logic
        res.status(200).json({ ok: true, message: "Successfully liked post" });
      }
      //check if autor if post is a connection to user or just a global creator
      const findPostAuthorInUserConnections = await userConnections.find({
        userId: userId,
        contactId: authorId,
      });
      const hashTagsInPost = [...postHashTages];
      const userMediaIntaractionHashTags =
        userMediaIntrest[0].mediaIntaractions.hashTags;
      const isAuthorAConnectionToUser =
        findPostAuthorInUserConnections.length !== 0 ? true : false;
      const updatedUserMediaIntaractionConnections = []; // values to add to user leaing data
      const updateduserMediaIntaractionGlobalConnections = []; // values to add to user leaing data
      // score for connections
      if (isAuthorAConnectionToUser) {
        // conections score
        const userMediaIntaractionConnections =
          userMediaIntrest[0].mediaIntaractions.connectionsMedia;
        if (userMediaIntaractionConnections.length !== 0) {
          const connectionsIdAdded = [];
          for (let i = 0; i < userMediaIntaractionConnections.length; i++) {
            const connectionsData = {
              connectionId: userMediaIntaractionConnections[i].connectionId,
            };
            if (connectionsData.connectionId === authorId) {
              const rate = userMediaIntaractionConnections[i].rate;
              const upDateConnectionsDataAndRate = {
                ...connectionsData,
                rate: rate >= 100 ? rate : rate + 0.5,
              };
              updatedUserMediaIntaractionConnections.push(
                upDateConnectionsDataAndRate,
              );
              connectionsIdAdded.push(connectionsData.connectionId);
            } else {
              const rate = userMediaIntaractionConnections[i].rate - 0.2;
              const upDateConnectionsDataAndRate = {
                ...connectionsData,
                rate: rate,
              };
              if (!(rate <= 0)) {
                updatedUserMediaIntaractionConnections.push(
                  upDateConnectionsDataAndRate,
                );
                connectionsIdAdded.push(connectionsData.connectionId);
              }
            }
            if (
              i + 1 === userMediaIntaractionConnections.length &&
              !connectionsIdAdded.includes(authorId)
            ) {
              const newConnectionData = {
                connectionId: authorId,
                rate: 0.5,
              };
              updatedUserMediaIntaractionConnections.push(newConnectionData);
              connectionsIdAdded.push(newConnectionData);
            }
          }
        } else {
          const newConnectionData = {
            connectionId: authorId,
            rate: 0.5,
          };
          updatedUserMediaIntaractionConnections.push(newConnectionData);
        }
        //for global coonections
        const userMediaIntaractionGlobalConnections =
          userMediaIntrest[0].mediaIntaractions.globalConnectionsMedia;
        for (const connections of userMediaIntaractionGlobalConnections) {
          const newGlobalConnectionData = {
            connectionId: connections.connectionId,
            rate: connections.rate - 0.2,
          };
          if (newGlobalConnectionData.rate > 0) {
            updateduserMediaIntaractionGlobalConnections.push(
              newGlobalConnectionData,
            );
          }
        }
      } else {
        const userMediaIntaractionGlobalConnections =
          userMediaIntrest[0].mediaIntaractions.globalConnectionsMedia;
        if (userMediaIntaractionGlobalConnections.length !== 0) {
          const globalConnectionsId = [];
          for (
            let i = 0;
            i < userMediaIntaractionGlobalConnections.length;
            i++
          ) {
            const connectionsData = {
              connectionId:
                userMediaIntaractionGlobalConnections[i].connectionId,
            };
            if (connectionsData.connectionId === authorId) {
              const rate = userMediaIntaractionGlobalConnections[i].rate;
              const upDateConnectionsDataAndRate = {
                ...connectionsData,
                rate: rate >= 100 ? rate : rate + 0.5,
              };
              updateduserMediaIntaractionGlobalConnections.push(
                upDateConnectionsDataAndRate,
              );
              globalConnectionsId.push(connectionsData.connectionId);
            } else {
              const rate = userMediaIntaractionGlobalConnections[i].rate - 0.2;
              const upDateConnectionsDataAndRate = {
                ...connectionsData,
                rate: rate,
              };
              if (!(rate <= 0)) {
                updateduserMediaIntaractionGlobalConnections.push(
                  upDateConnectionsDataAndRate,
                );
                globalConnectionsId.push(connectionsData.connectionId);
              }
            }
            if (i + 1 === userMediaIntaractionGlobalConnections) {
              const newGlobalConnectionData = {
                connectionId: authorId,
                rate: 0.5,
              };
              updateduserMediaIntaractionGlobalConnections.push(
                newGlobalConnectionData,
              );
              globalConnectionsId.push(authorId);
            }
          }
        } else {
          const newGlobalConnectionData = {
            connectionId: authorId,
            rate: 0.5,
          };
          updateduserMediaIntaractionGlobalConnections.push(
            newGlobalConnectionData,
          );
        }
        //for friends coonections
        const userMediaIntaractionConnections =
          userMediaIntrest[0].mediaIntaractions.connectionsMedia;
        for (const connections of userMediaIntaractionConnections) {
          const newConnectionData = {
            connectionId: connections.connectionId,
            rate: connections.rate - 0.2,
          };
          if (newConnectionData.rate > 0) {
            updatedUserMediaIntaractionConnections.push(newConnectionData);
          }
        }
      }
      //score for hastags
      const userHashTagesWithPostHashTags = [];
      const addedUserHashTagesWithPostHashTags = [];
      //
      if (hashTagsInPost.length !== 0) {
        const userHashTags = userMediaIntrest[0].mediaIntaractions.hashTags;
        if (userHashTags.length !== 0) {
          //
          for (let i = 0; i < hashTagsInPost.length; i++) {
            // added hastages in post
            const postHashTag = hashTagsInPost[i].trim();
            const hashTagsData = {
              tag: postHashTag,
            };
            for (let j = 0; j < userHashTags.length; j++) {
              if (
                userHashTags[j].tag.trim() === postHashTag &&
                !addedUserHashTagesWithPostHashTags.includes(postHashTag)
              ) {
                const rate = userHashTags[j].rate + 0.2;
                userHashTagesWithPostHashTags.push({
                  ...hashTagsData,
                  rate: rate,
                });
                addedUserHashTagesWithPostHashTags.push(postHashTag);
              }
              if (
                j + 1 === userHashTags.length &&
                !addedUserHashTagesWithPostHashTags.includes(postHashTag)
              ) {
                const rate = 0.2;
                userHashTagesWithPostHashTags.push({
                  ...hashTagsData,
                  rate: rate,
                });
                addedUserHashTagesWithPostHashTags.push(postHashTag);
              }
            }
          }
          ///
          for (let i = 0; i < userHashTags.length; i++) {
            if (
              !addedUserHashTagesWithPostHashTags.includes(
                userHashTags[i].tag.trim(),
              )
            ) {
              const hashTagsData = {
                tag: userHashTags[i].tag.trim(),
                rate: userHashTags[i].rate - 0.05,
              };
              if (hashTagsData.rate > 0) {
                userHashTagesWithPostHashTags.push(hashTagsData);
                addedUserHashTagesWithPostHashTags.push(hashTagsData.tag);
              }
            }
          }
        } else {
          for (let i = 0; i < hashTagsInPost.length; i++) {
            // added hastages in post
            const postHashTag = hashTagsInPost[i];
            const hashTagsData = {
              tag: postHashTag,
              rate: 0.2,
            };
            if (!addedUserHashTagesWithPostHashTags.includes(postHashTag)) {
              userHashTagesWithPostHashTags.push(hashTagsData);
              addedUserHashTagesWithPostHashTags.push(postHashTag);
            }
          }
        }
      } else {
        const userHashTags = userMediaIntrest[0].mediaIntaractions.hashTags;
        for (const tags of userHashTags) {
          userHashTagesWithPostHashTags.push(tags);
        }
      }
      //
      console.log(
        updatedUserMediaIntaractionConnections,
        updateduserMediaIntaractionGlobalConnections,
        userHashTagesWithPostHashTags,
      );
      const mediaIntaractions = {
        hashTags: userHashTagesWithPostHashTags,
        connectionsMedia: updatedUserMediaIntaractionConnections,
        globalConnectionsMedia: updateduserMediaIntaractionGlobalConnections,
      };
      const updateUserFeedsLearningData =
        await userLearningData.findOneAndUpdate(
          { userId: userId, connectionId: userConnectionId },
          { mediaIntaractions: mediaIntaractions },
        );
      if (updateUserFeedsLearningData) {
        console.log("user feeds algorithim learning ;)");
      }
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
    }
  },
);

module.exports = feedsIntaraction;
