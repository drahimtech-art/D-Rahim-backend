const express = require("express");
const feedsIntaraction = express.Router();
const feedsPost = require("../../modules/feeds/post.js");
const userLearningData = require("../../modules/feeds/userLearningData/userLearningData.js");
const userConnections = require("../../modules/userConnections.js");
const userData = require("../../modules/studentUser.js");
//middlewares
const apiRequstValidation = require("../../middlewares/apiValidation.js");
const validateUser = require("../../middlewares/userValidation.js");
const {
  userMediaIntaractionsScoreingAlgorithim,
} = require("./middlewares/userMediaIntaractionsScoreingAlgorithim.js");
//
//like post flow
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
      const userMediaIntrest = await userLearningData
        .find({
          userId: userId,
          connectionId: userConnectionId,
        })
        .lean();
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
      const findPostAuthorInUserConnections = await userConnections
        .find({
          userId: userId,
          contactId: authorId,
        })
        .lean();
      const hashTagsInPost = [...postHashTages];
      const userMediaIntaractionHashTags =
        userMediaIntrest[0].mediaIntaractions.hashTags;
      const isAuthorAConnectionToUser =
        findPostAuthorInUserConnections.length !== 0 ? true : false;
      //get media intaraction score
      const userMediaIntaractionsScore =
        userMediaIntaractionsScoreingAlgorithim(
          userMediaIntrest[0],
          isAuthorAConnectionToUser,
          authorId,
          hashTagsInPost,
        );
      if (userMediaIntaractionsScore) {
        const mediaIntaractions = {
          ...userMediaIntaractionsScore,
        };
        const updateUserFeedsLearningData =
          await userLearningData.findOneAndUpdate(
            { userId: userId, connectionId: userConnectionId },
            { mediaIntaractions: mediaIntaractions },
          );
        if (updateUserFeedsLearningData) {
          console.log("user feeds algorithim learning ;)");
        }
      }
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
    }
  },
);
//comments middleware
async function validateCommentsBody(req, res, next) {
  try {
    const postId = req.params.id;
    const body = req.body;
    const userConnectionId = body.connectionId;
    if (!postId)
      return res
        .status(400)
        .json({ ok: false, message: "invalide requst post id is required" });
    if (!userConnectionId)
      return res.status(400).json({
        ok: false,
        message: "invalide requst connection id is required",
      });
    if (!body.comment || !body.date || !body.time)
      return res.status(400).json({
        ok: false,
        message: `invalide comment body one or more fileds are required`,
      });
    next();
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
    console.log(`server error: ${error}`);
  }
}
feedsIntaraction.put(
  "/comments/post/:id",
  apiRequstValidation,
  validateUser,
  validateCommentsBody,
  async (req, res) => {
    try {
      const userId = res.tokenId;
      const postId = req.params.id;
      const body = req.body;
      const commentContent = {
        connectionId: body.connectionId,
        comment: body.comment,
        likes: 0,
        disLikes: 0,
        date: body.date,
        time: body.time,
        createdAt: new Date(),
        subComments: [],
      };
      const userConnectionId = body.connectionId;
      //get post
      const post = await feedsPost.find({ postId: postId }).lean();
      if (post.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: `no post with the given id found` });
      const userMediaIntrest = await userLearningData
        .find({
          userId: userId,
          connectionId: userConnectionId,
        })
        .lean();
      if (userMediaIntrest.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: "user feeds media doc not found" });
      //
      const authorId = post[0].connectionId;
      const postHashTages = post[0].hashTages;
      const postTotalLikes = post[0].engament.likes;
      const updatedCommentsCount = post[0].engament.comments + 1;
      const updatedCommentsData = [
        ...post[0].engamentStates.comments,
        commentContent,
      ];
      const engaments = {
        likes: postTotalLikes,
        comments: updatedCommentsCount,
        shares: post[0].shares,
      };
      const engamentStates = {
        likesId: postTotalLikes,
        comments: updatedCommentsData,
      };
      //update authors post with likes added
      const updatePost = await feedsPost.findOneAndUpdate(
        { postId: postId },
        { engament: engaments, engamentStates: engamentStates },
      );
      if (updatePost) {
        //end of authors and response logic
        res
          .status(200)
          .json({ ok: true, message: "Successfully commented on post" });
      }
      //check if autor if post is a connection to user or just a global creator
      const findPostAuthorInUserConnections = await userConnections
        .find({
          userId: userId,
          contactId: authorId,
        })
        .lean();
      const hashTagsInPost = [...postHashTages];
      const userMediaIntaractionHashTags =
        userMediaIntrest[0].mediaIntaractions.hashTags;
      const isAuthorAConnectionToUser =
        findPostAuthorInUserConnections.length !== 0 ? true : false;
      //get media intaraction score
      const userMediaIntaractionsScore =
        userMediaIntaractionsScoreingAlgorithim(
          userMediaIntrest[0],
          isAuthorAConnectionToUser,
          authorId,
          hashTagsInPost,
        );
      if (userMediaIntaractionsScore) {
        const mediaIntaractions = {
          ...userMediaIntaractionsScore,
        };
        const updateUserFeedsLearningData =
          await userLearningData.findOneAndUpdate(
            { userId: userId, connectionId: userConnectionId },
            { mediaIntaractions: mediaIntaractions },
          );
        if (updateUserFeedsLearningData) {
          console.log("user feeds algorithim learning ;)");
        }
      }
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
      console.log(`server error: ${error}`);
    }
  },
);
feedsIntaraction.post(
  "/author/info/",
  apiRequstValidation,
  validateUser,
  async (req, res) => {
    try {
      const authorsId = req.body;
      if (!authorsId)
        return res.status(400).json({
          ok: false,
          message: "invalid requst comments authors connection ids is required",
        });
      const findAuthors = await userData
        .find(
          { connectionId: { $in: authorsId } },
          {
            firstName: 1,
            lastName: 1,
            bio: 1,
            connectionId: 1,
            imageUrl: 1,
            _id: 0,
          },
        )
        .lean();
      if (findAuthors.length === 0)
        return res.status(404).json({
          ok: false,
          message: "the requsted authors not found in records",
        });
      const responds = [...findAuthors];
      res
        .status(200)
        .json({ ok: true, message: "succesful", author: responds });
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
      console.log(`server error: ${error}`);
    }
  },
);
module.exports = feedsIntaraction;
