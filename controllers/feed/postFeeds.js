const express = require("express");
const postFeeds = express.Router();
const feedsPosts = require("../../modules/feeds/post.js");
const { randomUUID } = require("crypto");
//middlewares
const apiRequstValidation = require("../../middlewares/apiValidation.js");
const userValdation = require("../../middlewares/userValidation.js");

//
postFeeds.post("/content", async (req, res) => {
  try {
    const contentBody = req.body;
    //const userId = contentBody.userId;
    const connectionId = contentBody.connectionId;
    const hashTages = contentBody.hashTages;
    const contentCaption = contentBody.caption;
    const contentType = "image";
    const postData = {
      connectionId: connectionId,
      engament: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
      content: {
        type: contentType,
        caption: contentCaption,
        content: "https://cloud/someimage",
      },
      engamentStates: {
        likesId: [],
        comments: [],
      },
      postId: `${connectionId}$${randomUUID()}`,
      hashTages: [...hashTages],
      date: "2024/02/28",
      time: "02:54",
      createdAt: new Date(),
    };
    const createPost = new feedsPosts(postData);
    const savePost = await createPost.save();
    if (!savePost) throw new Error(savePost);
    res.status(201).json({ ok: true, message: "succesful", post: savePost });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
  }
});

module.exports = postFeeds;
