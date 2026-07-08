const express = require("express");
const postFeeds = express.Router();
const feedsPosts = require("../../modules/feeds/post.js");
const multer = require("multer");
const path = require("path");
const { randomUUID } = require("crypto");
//middlewares
const apiRequstValidation = require("../../middlewares/apiValidation.js");
const userValdation = require("../../middlewares/userValidation.js");
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/feedsContent");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadMiddleware = multer({ storage: storage });
//
postFeeds.post(
  "/content",
  apiRequstValidation,
  userValdation,
  uploadMiddleware.single("media"),
  async (req, res) => {
    try {
      const body = JSON.parse(req.body.postContent);
      if (!body)
        return res.status(400).json({
          ok: false,
          message: "invalid requst body post content not found",
        });
      if (
        !body.connectionId ||
        !body.caption ||
        !body.type ||
        !body.date ||
        !body.time ||
        !body.hashTages
      )
        return res.status(400).json({
          ok: false,
          message:
            "invalid requst post content body one or more requiments not meat",
        });
      const filename = req.file && req.file.filename;
      const contentBody = body;
      //const userId = contentBody.userId;
      const connectionId = contentBody.connectionId;
      const hashTages = contentBody.hashTages;
      const contentCaption = contentBody.caption;
      const contentType = contentBody.type;
      const contentDate = contentBody.date;
      const contentTime = contentBody.time;
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
          content: `http://localhost:5000/feedsContent/${filename}`,
        },
        engamentStates: {
          likesId: [],
          comments: [],
        },
        postId: `${connectionId}$${randomUUID()}`,
        hashTages: [...hashTages],
        date: contentDate,
        time: contentTime,
        createdAt: new Date(),
      };
      const createPost = new feedsPosts(postData);
      const savePost = await createPost.save();
      if (!savePost) throw new Error(savePost);
      res.status(201).json({ ok: true, message: "succesful", post: postData });
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
    }
  },
);

module.exports = postFeeds;
