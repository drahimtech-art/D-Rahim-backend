const express = require("express");
const connectionsRouter = express.Router();
const userConnections = require("../modules/userConnections.js");
const contactMessage = require("../modules/contactMessage.js");
const userData = require("../modules/studentUser.js");
const multer = require("multer");
const path = require("path");
const { sendFileEvents } = require("./socket.js");
const { randomUUID } = require("crypto");
//middlewares
const apiRequstValidation = require("../middlewares/apiValidation.js");
const userValdation = require("../middlewares/userValidation.js");

//get contacts/connections
connectionsRouter.get(
  "/user/contacts",
  apiRequstValidation,
  userValdation,
  async (req, res) => {
    try {
      const userId = res.tokenId;
      const requst = await userConnections.find({ userId: userId });
      if (requst.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: "no connections found" });
      res
        .status(200)
        .json({ ok: true, message: "succesful", connections: requst });
    } catch (error) {
      console.log(`server error : ${error}`);
      res.status(500).json({ ok: false, message: `server error : ${error}` });
    }
  },
);
//add contacts/connnections
connectionsRouter.post(
  "/user/add/:id",
  apiRequstValidation,
  async (req, res) => {
    const userId = req.body.userId;
    const contactId = req.params.id;
    try {
      const doesConnectionExist = await userConnections.find({
        userId: userId,
        contactId: contactId,
      });
      if (doesConnectionExist.length !== 0)
        return res.status(403).json({
          ok: false,
          message: "Contact exist in user connections list",
        });
      const findContact = await userData.find({ connectionId: contactId });
      if (findContact.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: "no user with the given id found" });
      const chatGroupId = `${randomUUID()}$${contactId}`;
      const connectionInfo = {
        userId: userId,
        contactId: contactId,
        chatGroupId: chatGroupId,
      };
      const addConnection = new userConnections(connectionInfo);
      const responds = await addConnection.save();
      //devmode change to connection requst later
      const connectionInfoForFriend = {
        userId: findContact[0]._id,
        contactId: findContact[0].connectionId,
        chatGroupId: chatGroupId,
      };
      const addConnectionForFriend = new userConnections(
        connectionInfoForFriend,
      );
      const respondsForFriend = await addConnectionForFriend.save();
      if (!responds || respondsForFriend)
        return res.status(403).json({
          ok: false,
          message: `something went wrong can't add connection at this time`,
        });
      res.status(201).json({ ok: true, message: "connection requst sent" });
    } catch (error) {
      console.log(`server error : ${error}`);
      res.status(500).json({ ok: false, message: `server error : ${error}` });
    }
  },
);
//get message history of contact/connections
//req body middleware
async function validateReqBody(req, res, next) {
  try {
    const body = req.body;
    if (!body)
      return res
        .status(400)
        .json({ ok: false, message: "invalide requst body" });
    const connectionId = body.connectionId;
    const contactId = body.contactId;
    if (!connectionId || !contactId)
      return res
        .status(400)
        .json({ ok: false, message: "invalide requst body" });
    res.body = body;
    next();
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
  }
}
//get chat history of group
connectionsRouter.post(
  "/contact/messages",
  apiRequstValidation,
  userValdation,
  validateReqBody,
  async (req, res) => {
    try {
      const body = res.body;
      const groupId = body.groupId;
      const findChatHistory = await contactMessage
        .find({ groupId: groupId })
        .sort({ "messages.createdAt": -1 })
        .limit(50);
      if (findChatHistory.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: "No chat history found" });
      const respondsList = await findChatHistory.map((e) => {
        const dataFomart = {
          from: e.messages.from,
          to: e.messages.to,
          type: e.messages.type,
          imgUrl: e.messages.imgUrl,
          date: e.messages.date,
          time: e.messages.time,
          text: e.messages.text,
        };
        return dataFomart;
      });
      const reversedArray = respondsList.reverse();
      res.status(200).json({
        ok: true,
        message: "chat records retrived succesfull",
        chatHistory: reversedArray,
      });
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
    }
  },
);
//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadMiddleware = multer({ storage: storage });
//middleware
async function validateImageBody(data, req, res) {
  try {
    const body = data;
    console.log(body);
    if (!body)
      return res
        .status(400)
        .json({ ok: false, message: "invalide requst body" });
    if (!body.message || !body.room)
      return res
        .status(400)
        .json({ ok: false, message: "invalide requst body" });
    if (body.room.trim() === "")
      return res.status(400).json({ ok: false, message: "invalide room " });
    if (
      !body.message.date ||
      !body.message.from ||
      !body.message.to ||
      !body.message.imgUrl ||
      !body.message.time ||
      !body.message.type
    )
      return res
        .status(400)
        .json({ ok: false, message: "invalide requst body" });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error : ${error}` });
  }
}
//upload images
connectionsRouter.post(
  "/upload/file",
  apiRequstValidation,
  userValdation,
  uploadMiddleware.single("image"),
  async (req, res) => {
    try {
      const filename = req.file.filename;
      const body = JSON.parse(req.body.message);
      const oldMessage = body.message;
      const room = body.room;
      console.log(room);
      const updatedMessage = {
        from: oldMessage.from,
        to: oldMessage.to,
        type: "image",
        imgUrl: `http://localhost:5000/${filename}`,
        date: oldMessage.date,
        time: oldMessage.time,
        text: "",
      };
      sendFileEvents(updatedMessage, room);
      res.status(200).json({ ok: true, message: "succesfully uploaded" });
      //sendFileEvents()
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error : ${error}` });
    }
  },
);
module.exports = connectionsRouter;
