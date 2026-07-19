const express = require("express");
const feedsIntaraction = express.Router();
const feedsPost = require("../../modules/feeds/post.js");
const userLearningData = require("../../modules/feeds/userLearningData/userLearningData.js");
const userConnections = require("../../modules/userConnections.js");
const postLikes = require("../../modules/feeds/postLikes.js");
const postComments = require("../../modules/feeds/postComments.js");
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
      if (
        !userConnectionId ||
        userConnectionId.trim() === "" ||
        userConnectionId.length < 10
      )
        return res.status(400).json({
          ok: false,
          message: "invalide requst connection id is required",
        });
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
      const getPost = await feedsPost.find({ postId: postId });
      if (getPost.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: `no post with the given id found` });
      const validatePostWasLikedByUser = await postLikes
        .find({ postId: postId, connectionId: userConnectionId })
        .lean();
      let isPostLIkedAlreadyByUser =
        validatePostWasLikedByUser.length !== 0 ? true : false;
      if (isPostLIkedAlreadyByUser) {
        // if post was liked unlike post
        const deleteUserLikedDoc = await postLikes.findOneAndDelete({
          postId: postId,
          connectionId: userConnectionId,
        });
        const unlikePost = await feedsPost.findOneAndUpdate(
          { postId: postId },
          { $inc: { "engament.likes": -1 } },
        );
        res
          .status(200)
          .json({ ok: true, message: "Successfully unliked post" });
      } else {
        const likeDoc = {
          postId: postId,
          connectionId: userConnectionId,
          createdAt: new Date(),
        };
        const createLike = await postLikes.insertOne(likeDoc);
        const likePost = await feedsPost.findOneAndUpdate(
          { postId: postId },
          { $inc: { "engament.likes": +1 } },
        );
        res.status(200).json({ ok: true, message: "Successfully liked post" });
      }
      const authorId = getPost[0].connectionId;
      //check if autor post is a connection to user or just a global creator
      const findPostAuthorInUserConnections = await userConnections
        .find({
          userId: userId,
          contactId: authorId,
        })
        .lean();
      const hashTagsInPost = [...getPost[0].hashTages];
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
          !isPostLIkedAlreadyByUser,
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
      //res.status(500).json({ ok: false, message: `server error: ${error}` });
      console.log(`server error: ${error}`);
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
    if (!body.comment || !body.commentedAt)
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
//add top comments
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
        postId: postId,
        parentId: postId,
        depth: 0,
        authorId: body.connectionId,
        comment: body.comment,
        likesCount: 0,
        dislikeCount: 0,
        replyCount: 0,
        commentedAt: body.commentedAt,
        createdAt: new Date(),
      };
      const userConnectionId = body.connectionId;
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
      const post = await feedsPost.find({ postId: postId }).lean();
      if (post.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: `no post with the given id found` });
      //
      const authorId = post[0].connectionId;
      const postHashTages = post[0].hashTages;
      //update post comment count
      const updatePost = await feedsPost.findOneAndUpdate(
        { postId: postId },
        { $inc: { "engament.comments": +1 } },
      );
      const createComment = await postComments.insertOne(commentContent);
      if (!createComment)
        return res.status(500).json({
          ok: false,
          message: `server error somthing whent wrong while creating comment: ${createComment}`,
        });
      //end of authors and response logic
      res.status(200).json({
        ok: true,
        message: "Successfully commented on post",
        comment: createComment,
      });
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
          true,
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
//get comments authors
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
//reply to comment
feedsIntaraction.put(
  "/reply/comments/:id",
  apiRequstValidation,
  validateUser,
  validateCommentsBody,
  async (req, res) => {
    try {
      const userId = res.tokenId;
      const commentToReplyId = req.body.commentToReplyId;
      const postId = req.params.id;
      const body = req.body;
      const userConnectionId = body.connectionId;
      if (!postId || !commentToReplyId)
        return res.status(400).json({
          ok: false,
          message: `invalid requst body one or more fileds not meat`,
        });
      const getPost = await feedsPost.find({ postId: postId }).lean();
      if (getPost.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: `no post with the given id found` });

      const authorId = getPost[0].connectionId;
      const postHashTages = getPost[0].hashTages;
      //get depth of parent comment
      const getParentComment = await postComments
        .findById(commentToReplyId)
        .lean();
      if (!getParentComment)
        return res.status(403).json({
          ok: false,
          message:
            "somthing went wrong cant replay to comments as no parent was found",
        });
      const depth = getParentComment.depth;
      //
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
      const commentContent = {
        postId: postId,
        parentId: commentToReplyId,
        depth: depth + 1,
        authorId: body.connectionId,
        comment: body.comment,
        likesCount: 0,
        dislikeCount: 0,
        replyCount: 0,
        commentedAt: body.commentedAt,
        createdAt: new Date(),
      };
      //create commentReply
      const createCommentReply = await postComments.insertOne(commentContent);
      if (!createCommentReply)
        return res.status(500).json({
          ok: false,
          message: `server error somthing went wrong while trying to reply to comment ${createComment}`,
        });
      //update parent reply count
      const upDateParentCommentCount = await postComments.findByIdAndUpdate(
        commentToReplyId,
        { $inc: { replyCount: +1 } },
      );
      //update post comment count
      const updatePost = await feedsPost.findOneAndUpdate(
        { postId: postId },
        { $inc: { "engament.comments": +1 } },
      );
      if (!updatePost)
        return res.status(500).json({
          ok: false,
          message: `server error somthing went wrong while trying to update post comment count ${updatePost}`,
        });
      //end of authors and response logic
      res.status(200).json({
        ok: true,
        message: "Successfully replied to comment",
        comment: commentContent,
      });

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
          true,
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
      res.status(500).json({ ok: false, message: `server error :${error}` });
      console.log(`server error :${error}`);
    }
  },
);
feedsIntaraction.post("/post/sub/comments/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const commentsParentId = req.body.commentsParentId;
    if (!postId || !commentsParentId)
      return res.status(400).json({
        ok: false,
        message: `invalid requst body one or more fileds not meat`,
      });
    const getPost = await feedsPost.find({ postId: postId }).lean();
    if (getPost.length === 0)
      return res
        .status(404)
        .json({ ok: false, message: `no post with the given id found` });
    const getAllChildComments = await postComments
      .find({ postId: postId, parentId: commentsParentId })
      .lean();
    if (getAllChildComments.length === 0)
      return res
        .status(404)
        .json({ ok: false, message: `no comments with the given parent id` });

    const commentsAuthorsIds = [];
    for (const comment of getAllChildComments) {
      commentsAuthorsIds.push(comment.authorId);
    }
    const getAuthorInfor = await userData
      .find(
        { connectionId: { $in: commentsAuthorsIds } },
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
      return res
        .status(404)
        .json({ ok: false, message: "no authors of comments found" });
    const orderedCommentsWithAutors = [];
    for (let c = 0; c < getAllChildComments.length; c++) {
      const comment = getAllChildComments[c];
      for (let a = 0; a < getAuthorInfor.length; a++) {
        const author = getAuthorInfor[a];
        if (author.connectionId === comment.authorId) {
          const authorWithOutConnectionId = {
            firstName: author.firstName,
            lastName: author.lastName,
            imageUrl: author.imageUrl,
          };
          const formatedComments = { ...authorWithOutConnectionId, ...comment };
          orderedCommentsWithAutors.push(formatedComments);
          break;
        }
      }
    }
    res.status(200).json({
      ok: true,
      message: "successful",
      subComments: orderedCommentsWithAutors,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
  }
});
module.exports = feedsIntaraction;
