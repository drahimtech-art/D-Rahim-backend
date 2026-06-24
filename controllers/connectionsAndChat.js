const express = require("express");
const connectionsRouter = express.Router();
const userConnections = require("../modules/userConnections.js");
const contactMessage = require("../modules/contactMessage.js");
const userData = require("../modules/studentUser.js");
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
      const connectionInfo = {
        userId: userId,
        contactFirstName: findContact[0].firstName,
        contactLastName: findContact[0].lastName,
        contactId: contactId,
        contactImage: findContact[0].imageUrl ? findContact[0].imageUrl : null,
      };
      const addConnection = new userConnections(connectionInfo);
      const responds = await addConnection.save();
      if (!responds)
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
connectionsRouter.post(
  "/contact/messages",
  apiRequstValidation,
  userValdation,
  validateReqBody,
  async (req, res) => {
    try {
      const body = res.body;
      const connectionId = body.connectionId;
      const contactId = body.contactId;
      const findChatHistory = await contactMessage
        .find({
          connectionId: connectionId,
          contactId: contactId,
        })
        .sort({ createdAt: 1 })
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

      res.status(200).json({
        ok: true,
        message: "chat records retrived succesfull",
        chatHistory: respondsList,
      });
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
    }
  },
);
module.exports = connectionsRouter;
