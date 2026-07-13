const express = require("express");
const connectionsRouter = express.Router();
const userConnections = require("../modules/userConnections.js");
const contactMessage = require("../modules/contactMessage.js");
const userData = require("../modules/studentUser.js");
const connectionsRequst = require("../modules/connectionsRequst.js");
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
      const requst = await userConnections.find({ userId: userId }).lean();
      if (requst.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: "no connections found" });
      //
      const connectionsId = [];
      for (let i = 0; i < requst.length; i++) {
        connectionsId.push(requst[i].contactId);
      }
      //
      const allConnectionsInfo = await userData
        .find(
          { connectionId: { $in: connectionsId } },
          { firstName: 1, lastName: 1, connectionId: 1, imageUrl: 1, bio: 1 },
        )
        .lean();
      //
      const connectionsList = [];
      for (let i = 0; i < allConnectionsInfo.length; i++) {
        const halfInfo = {
          contactFirstName: allConnectionsInfo[i].firstName,
          contactLastName: allConnectionsInfo[i].lastName,
          contactId: allConnectionsInfo[i].connectionId,
          contactImage: allConnectionsInfo[i].imageUrl,
          bio: allConnectionsInfo[i].bio,
        };
        for (let j = 0; j < requst.length; j++) {
          if (halfInfo.contactId === requst[j].contactId) {
            const fullInfo = {
              ...halfInfo,
              invite: requst[j].invite,
              isConnected: requst[j].isConnected,
              chatGroupId: requst[j].chatGroupId,
            };
            connectionsList.push(fullInfo);
            break;
          }
        }
      }
      //
      if (connectionsList.length === 0)
        return res.status(500).json({
          ok: false,
          message:
            "somthing went wrong while trying to filter & conbine connections list ",
        });
      res
        .status(200)
        .json({ ok: true, message: "succesful", connections: connectionsList });
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
  userValdation,
  async (req, res) => {
    const userId = res.tokenId;
    const contactId = req.params.id;
    const connectionId = req.body.connectionId;
    try {
      if (!contactId || !connectionId)
        return res.status(400).json({
          ok: false,
          message: "invalide requst body one or more fields is missing",
        });
      const doesConnectionExist = await userConnections
        .find({
          userId: userId,
          contactId: contactId,
        })
        .lean();
      if (doesConnectionExist.length !== 0)
        return res.status(403).json({
          ok: false,
          message: "Contact exist in user connections list",
        });
      const findContact = await userData
        .find({ connectionId: contactId })
        .lean();
      if (findContact.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: "no user with the given id found" });
      const hasConnectionToAddSentRequst = await connectionsRequst
        .find({
          userId: userId,
          connectionId: connectionId,
        })
        .lean();
      if (hasConnectionToAddSentRequst.length !== 0) {
        // accepy requst if friend to add sent user requst
        const requstList = hasConnectionToAddSentRequst[0].requstList;
        let isResutInList;
        let foundData;
        const updatedAndApprovedRequstList = [];
        for (const requst of requstList) {
          if (requst.contactId === contactId && !requst.isConnected) {
            isResutInList = true;
            const connectionRequstInfo = {
              contactId: requst.contactId,
              chatGroupId: requst.chatGroupId,
              invite: true,
              isConnected: true,
              createdAt: requst.createdAt,
            };
            foundData = connectionRequstInfo;
            updatedAndApprovedRequstList.push(connectionRequstInfo);
          } else {
            updatedAndApprovedRequstList.push(requst);
          }
        }
        if (isResutInList) {
          const acceptRequst = await connectionsRequst.findOneAndUpdate(
            { userId: userId, connectionId: connectionId },
            { requstList: updatedAndApprovedRequstList },
          );
          const upDateFriendContactInfor =
            await userConnections.findOneAndUpdate(
              { userId: findContact[0]._id, contactId: connectionId },
              { isConnected: true },
            );
          const addConnection = new userConnections({
            userId: userId,
            contactId: foundData.contactId,
            chatGroupId: foundData.chatGroupId,
            invite: foundData.invite,
            isConnected: foundData.isConnected,
            createdAt: new Date(),
          });
          const saveConatact = await addConnection.save();
          if (!acceptRequst || !upDateFriendContactInfor || !saveConatact)
            return res.status(500).json({
              ok: false,
              message:
                "server error somthing went wrong when trying to validate user connection requst",
            });
          return res
            .status(200)
            .json({ ok: true, message: "connections succesful added" });
        }
      }
      const chatGroupId = `${randomUUID()}$${contactId}`;
      const connectionInfoToBeSent = {
        contactId: connectionId,
        chatGroupId: chatGroupId,
        invite: true,
        isConnected: false,
        createdAt: new Date(),
      };
      const sendRequst = await connectionsRequst.findOneAndUpdate(
        {
          userId: findContact[0]._id,
          connectionId: findContact[0].connectionId,
        },
        { $push: { requstList: connectionInfoToBeSent } },
      );
      if (!sendRequst)
        return res
          .status(500)
          .json({ ok: false, message: "failed to send connection requst" });
      const connectionInfoToAdded = {
        contactId: contactId,
        chatGroupId: chatGroupId,
        invite: true,
        isConnected: false,
        createdAt: connectionInfoToBeSent.createdAt,
      };
      const addConnection = new userConnections({
        userId: userId,
        ...connectionInfoToAdded,
      });
      const responds = await addConnection.save();
      const createMessageGroupForConnections = new contactMessage({
        groupId: chatGroupId,
        messages: [],
        createdAt: new Date(),
      });
      const saveMessageGroup = await createMessageGroupForConnections.save();
      if (!responds || !createMessageGroupForConnections)
        return res.status(403).json({
          ok: false,
          message: `something went wrong can't add connection at this time`,
        });
      res.status(200).json({ ok: true, message: "requst sent succesfuly" });
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
    if (!body || !body.groupId)
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
        .limit(50)
        .lean();
      if (findChatHistory.length === 0)
        return res
          .status(404)
          .json({ ok: false, message: "No chat history found" });
      const respondsList = findChatHistory[0].messages.map((e) => {
        const dataFomart = {
          from: e.from,
          to: e.to,
          type: e.type,
          imgUrl: e.imgUrl,
          date: e.date,
          time: e.time,
          text: e.text,
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
//get connections requst
connectionsRouter.get(
  "/requst/:id",
  apiRequstValidation,
  userValdation,
  async (req, res) => {
    try {
      const userId = res.tokenId;
      const connectionId = req.params.id;
      if (!userId || !connectionId)
        return res.status(400).json({
          ok: false,
          message: "invalide requst body one or more fields is missing",
        });
      const getAllConnectionsRequstListNotYetValidated = await connectionsRequst
        .find({
          userId: userId,
          connectionId: connectionId,
        })
        .lean();
      const connectionsRequstlist = [];
      if (
        getAllConnectionsRequstListNotYetValidated.length !== 0 &&
        getAllConnectionsRequstListNotYetValidated[0].requstList.length !== 0
      ) {
        const filteredListOfNotValidatedRequst = [];
        const filteredListOfNotValidatedRequstId = [];
        for (const requst of getAllConnectionsRequstListNotYetValidated[0]
          .requstList) {
          if (!requst.isConnected) {
            filteredListOfNotValidatedRequst.push(requst);
            filteredListOfNotValidatedRequstId.push(requst.contactId);
          }
        }
        const getRequstConnectionsSendersInfor = await userData
          .find(
            { connectionId: { $in: filteredListOfNotValidatedRequstId } },
            {
              firstName: 1,
              lastName: 1,
              connectionId: 1,
              imageUrl: 1,
              bio: 1,
              _id: 0,
            },
          )
          .lean();
        if (getRequstConnectionsSendersInfor.length !== 0) {
          for (let i = 0; i < getRequstConnectionsSendersInfor.length; i++) {
            const contactDataFromRequst = filteredListOfNotValidatedRequst[i];
            const userData = getRequstConnectionsSendersInfor[i];
            if (contactDataFromRequst.contactId === userData.connectionId) {
              const requstFormatedData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                imageUrl: userData.imageUrl,
                bio: userData.bio,
                contactId: contactDataFromRequst.contactId,
                invite: contactDataFromRequst.invite,
                isConnected: contactDataFromRequst.isConnected,
              };
              connectionsRequstlist.push(requstFormatedData);
            }
          }
        }
        res.status(200).json({
          ok: true,
          message: "succesful fecth connection requst",
          requsts: connectionsRequstlist,
        });
      }
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
      console.log(`server error: ${error}`);
    }
  },
  //accept connection requst
  connectionsRouter.post(
    "/accept/requst/:id",
    apiRequstValidation,
    userValdation,
    async (req, res) => {
      const userId = res.tokenId;
      const contactId = req.params.id;
      const connectionId = req.body.connectionId;
      try {
        if (!contactId || !connectionId)
          return res.status(400).json({
            ok: false,
            message: "invalide requst body one or more fields is missing",
          });
        const doesConnectionExist = await userConnections
          .find({
            userId: userId,
            contactId: contactId,
          })
          .lean();
        if (doesConnectionExist.length !== 0)
          return res.status(403).json({
            ok: false,
            message: "Contact exist in user connections list",
          });
        const findContact = await userData
          .find({ connectionId: contactId })
          .lean();
        if (findContact.length === 0)
          return res
            .status(404)
            .json({ ok: false, message: "no user with the given id found" });
        const connectionsRequstList = await connectionsRequst
          .find({
            userId: userId,
            connectionId: connectionId,
          })
          .lean();
        if (connectionsRequstList.length !== 0) {
          // accepy requst if friend to add sent user requst
          const requstList = connectionsRequstList[0].requstList;
          let isResutInList;
          let foundData;
          const updatedAndApprovedRequstList = [];
          for (const requst of requstList) {
            if (requst.contactId === contactId && !requst.isConnected) {
              isResutInList = true;
              const connectionRequstInfo = {
                contactId: requst.contactId,
                chatGroupId: requst.chatGroupId,
                invite: true,
                isConnected: true,
                createdAt: requst.createdAt,
              };
              foundData = connectionRequstInfo;
              updatedAndApprovedRequstList.push(connectionRequstInfo);
            } else {
              updatedAndApprovedRequstList.push(requst);
            }
          }
          if (isResutInList) {
            const acceptRequst = await connectionsRequst.findOneAndUpdate(
              { userId: userId, connectionId: connectionId },
              { requstList: updatedAndApprovedRequstList },
            );
            const upDateFriendContactInfor =
              await userConnections.findOneAndUpdate(
                { userId: findContact[0]._id, contactId: connectionId },
                { isConnected: true },
              );
            const addConnection = new userConnections({
              userId: userId,
              contactId: foundData.contactId,
              chatGroupId: foundData.chatGroupId,
              invite: foundData.invite,
              isConnected: foundData.isConnected,
              createdAt: new Date(),
            });
            const saveConatact = await addConnection.save();
            if (!acceptRequst || !upDateFriendContactInfor || !saveConatact)
              return res.status(500).json({
                ok: false,
                message:
                  "server error somthing went wrong when trying to validate user connection requst",
              });
            return res
              .status(200)
              .json({ ok: true, message: "connections succesful added" });
          }
        }
        return res.status(404).json({
          ok: false,
          message: "no connection requst found in user records",
        });
      } catch (error) {
        res.status(500).json({ ok: false, message: `server error: ${error}` });
        console.log(`server error: ${error}`);
      }
    },
  ),
);
module.exports = connectionsRouter;
