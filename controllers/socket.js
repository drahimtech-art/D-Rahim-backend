const { Server } = require("socket.io");
const userValidation = require("jsonwebtoken");
const randomUUID = require("crypto").randomUUID;
const contactMessages = require("../modules/contactMessage");
const analyticsData = require("../modules/admin/Analytics");
const getServer = require("../server");
const { onlineUsers } = require("./students/cache/cache");
const serverPort = getServer();
//contect to socket
const io = new Server(serverPort, {
  cors: {
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_DEV],
    credentials: true,
  },
});

//middleware
async function validateUser(socket) {
  try {
    const token = socket.handshake.headers.cookie.split("=")[1];
    const isUser = userValidation.verify(token, process.env.ACCESS_TOKEN);
    if (!isUser) return socket.disconnect();
  } catch (error) {
    console.log(`server error validating user socket requst ${error}`);
  }
}
async function validateClient(socket) {
  try {
    const clientId = socket.handshake.headers["x-frontend-key"];
    if (clientId !== process.env.CLIENT_KEY) return socket.disconnect();
  } catch (error) {
    console.log(
      `server error validating which client requst socket requst ${error}`,
    );
  }
}
// save chat to db func

async function saveChatToDB(chatId, messages) {
  try {
    const addChatToList = await contactMessages.insertOne({
      groupId: chatId,
      messages: messages,
      createdAt: new Date(),
    });
    if (addChatToList) {
      console.log("Chat history created succesfull");
    } else {
      console.log("Chat history creation failed");
    }
  } catch (error) {
    console.log(`server error: ${error}`);
  }
}
//
async function sendFileEvents(messages, room) {
  if (!io) return;
  try {
    const connectionId = messages.from;
    const contactId = messages.to;
    saveChatToDB(room.chatId, messages);
    io.to(room.connection).emit("receive-message", messages);
  } catch (error) {
    console.log(error);
  }
}
//students socket logic
async function StudentsSocketSection(socket) {
  try {
    //middleware
    await validateUser(socket);
    await validateClient(socket);
    //
    console.log(socket.id);
    socket.on("join-room", (room) => {
      socket.join(room);
      onlineUsers.add(room);
    });
    socket.on("leave-room", (room) => {
      socket.leave(room);
      onlineUsers.delete(room);
    });
    socket.on("isOnline", (room, callback) => {
      callback(onlineUsers.has(room));
    });

    socket.on("send-message", (messages, room) => {
      const connectionId = messages.from;
      const contactId = messages.to;
      saveChatToDB(room.chatId, messages);
      socket.to(room.connection).emit("receive-message", messages);
    });
  } catch (error) {
    console.log(error);
  }
}

//validated visited user db
const validatedVisitedUserDataDb = new Map();
let isCreatingAnalyticsDbDoc = false;
//free validatedVisitedUserData resources if in storage for 1 hour
setInterval(() => {
  const userDataToBeDelated = [];
  validatedVisitedUserDataDb.forEach((data) => {
    const currentTime = new Date().toISOString();
    const [cDate, cTime] = currentTime.split("T");
    const [dDate, dTime] = data.dateVisited.split("T");
    const userId = data.userId;
    if (cDate !== dDate) {
      userDataToBeDelated.push(userId);
    } else {
      const currentHour = Number(cTime.split(":")[0]);
      const dataHour = Number(dTime.split(":")[0]);
      if (currentHour > dataHour) {
        userDataToBeDelated.push(userId);
      }
    }
  });
  //
  userDataToBeDelated.forEach((userId) => {
    validatedVisitedUserDataDb.delete(userId);
  });
}, 20000); // 10min
//

async function AnalyticsSocketSection(socket) {
  try {
    //
    socket.on("validated-new-user", (userData) => {
      console.log("ping recived");
      if (!userData || !userData.userId) return;
      const userId = userData.userId;
      //
      const pingCurrentTime = new Date().toISOString();
      //
      async function addDataToAnalytics() {
        try {
          const todaysDate = new Date().toDateString();
          const findThisMonthsAnalyticsData = await analyticsData
            .find({ dateMonthYearDate: todaysDate })
            .lean();
          if (findThisMonthsAnalyticsData.length === 0) {
            if (isCreatingAnalyticsDbDoc) return;
            console.log("no month data adding new");
            let pagesViewed = 0;
            userData.pageVisited.homePage && (pagesViewed += 1);
            userData.pageVisited.servicesPage && (pagesViewed += 1);
            userData.pageVisited.aboutPage && (pagesViewed += 1);
            userData.pageVisited.mentorshipPage && (pagesViewed += 1);
            userData.pageVisited.contactPage && (pagesViewed += 1);
            isCreatingAnalyticsDbDoc = true; // analytics month doc duplication fix on multiple requst;
            const createThisMonthsAnalyticsData = await analyticsData.insertOne(
              {
                dateMonthYearDate: todaysDate,
                liveVistors: 1,
                newUsers: 0,
                pageViewed: pagesViewed,
                bouncedBackUsers: 0,
                returningUsers: 0,
                deviceType: {
                  desktop: userData.deviceType.desktop ? 1 : 0,
                  mobile: userData.deviceType.mobile ? 1 : 0,
                  tablet: userData.deviceType.tablet ? 1 : 0,
                  other: userData.deviceType.other ? 1 : 0,
                },
                platformVisitedFrom: {
                  facebook: userData.platformVisitedFrom.facebook ? 1 : 0,
                  linkedIn: userData.platformVisitedFrom.linkedIn ? 1 : 0,
                  youtub: userData.platformVisitedFrom.youtub ? 1 : 0,
                  tiktok: userData.platformVisitedFrom.tiktok ? 1 : 0,
                  behance: userData.platformVisitedFrom.behance ? 1 : 0,
                  instagram: userData.platformVisitedFrom.instagram ? 1 : 0,
                  twitter: userData.platformVisitedFrom.twitter ? 1 : 0,
                  google: userData.platformVisitedFrom.google ? 1 : 0,
                  pintrest: userData.platformVisitedFrom.pintrest ? 1 : 0,
                  other: userData.platformVisitedFrom.other ? 1 : 0,
                },
              },
            );
            validatedVisitedUserDataDb.set(userId, {
              ...userData,
              dateVisited: pingCurrentTime,
            });
            if (createThisMonthsAnalyticsData) {
              isCreatingAnalyticsDbDoc = false;
              console.log("successfully created this month analytics");
            }
          } else {
            const dateMonthYearDate = todaysDate;
            const oldUserVistedData = validatedVisitedUserDataDb.get(userId);
            console.log("found month data runing logic");
            let pagesViewed = 0;
            if (oldUserVistedData) {
              oldUserVistedData.pageVisited.homePage
                ? (pagesViewed += 0)
                : userData.pageVisited.homePage
                  ? (pagesViewed += 1)
                  : (pagesViewed += 0);
              oldUserVistedData.pageVisited.servicesPage
                ? (pagesViewed += 0)
                : userData.pageVisited.servicesPage
                  ? (pagesViewed += 1)
                  : (pagesViewed += 0);
              oldUserVistedData.pageVisited.aboutPage
                ? (pagesViewed += 0)
                : userData.pageVisited.aboutPage
                  ? (pagesViewed += 1)
                  : (pagesViewed += 0);
              oldUserVistedData.pageVisited.mentorshipPage
                ? (pagesViewed += 0)
                : userData.pageVisited.mentorshipPage
                  ? (pagesViewed += 1)
                  : (pagesViewed += 0);
              oldUserVistedData.pageVisited.contactPage
                ? (pagesViewed += 0)
                : userData.pageVisited.contactPage
                  ? (pagesViewed += 1)
                  : (pagesViewed += 0);
            } else {
              userData.pageVisited.homePage
                ? (pagesViewed += 1)
                : (pagesViewed += 0);
              userData.pageVisited.servicesPage
                ? (pagesViewed += 1)
                : (pagesViewed += 0);
              userData.pageVisited.aboutPage
                ? (pagesViewed += 1)
                : (pagesViewed += 0);
              userData.pageVisited.mentorshipPage
                ? (pagesViewed += 1)
                : (pagesViewed += 0);
              userData.pageVisited.contactPage
                ? (pagesViewed += 1)
                : (pagesViewed += 0);
            }
            //
            const liveVistors = oldUserVistedData
              ? findThisMonthsAnalyticsData[0].liveVistors
              : findThisMonthsAnalyticsData[0].liveVistors + 1;
            const newPagesViewed =
              findThisMonthsAnalyticsData[0].pagesViewed + pagesViewed;
            const newUsers = findThisMonthsAnalyticsData[0].newUsers;
            const bouncedBackUsers =
              findThisMonthsAnalyticsData[0].bouncedBackUsers;
            const returningUsers =
              findThisMonthsAnalyticsData[0].returningUsers;
            const deviceType = {
              desktop: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].deviceType.desktop
                : findThisMonthsAnalyticsData[0].deviceType.desktop +
                  (userData.deviceType.desktop ? 1 : 0),
              mobile: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].deviceType.mobile
                : findThisMonthsAnalyticsData[0].deviceType.mobile +
                  (userData.deviceType.mobile ? 1 : 0),
              tablet: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].deviceType.tablet
                : findThisMonthsAnalyticsData[0].deviceType.tablet +
                  (userData.deviceType.tablet ? 1 : 0),
              other: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].deviceType.other
                : findThisMonthsAnalyticsData[0].deviceType.other +
                  (userData.deviceType.other ? 1 : 0),
            };
            const platformVisitedFrom = {
              facebook: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.facebook
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.facebook +
                  (userData.platformVisitedFrom.facebook ? 1 : 0),
              linkedIn: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.linkedIn
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.linkedIn +
                  (userData.platformVisitedFrom.linkedIn ? 1 : 0),
              youtub: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.youtub
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.youtub +
                  (userData.platformVisitedFrom.youtub ? 1 : 0),
              tiktok: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.tiktok
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.tiktok +
                  (userData.platformVisitedFrom.tiktok ? 1 : 0),
              behance: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.behance
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.behance +
                  (userData.platformVisitedFrom.behance ? 1 : 0),
              instagram: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.instagram
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.instagram +
                  (userData.platformVisitedFrom.instagram ? 1 : 0),
              twitter: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.twitter
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.twitter +
                  (userData.platformVisitedFrom.twitter ? 1 : 0),
              google: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.google
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.google +
                  (userData.platformVisitedFrom.google ? 1 : 0),
              pintrest: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.pintrest
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.pintrest +
                  (userData.platformVisitedFrom.pintrest ? 1 : 0),
              other: oldUserVistedData
                ? findThisMonthsAnalyticsData[0].platformVisitedFrom.other
                : findThisMonthsAnalyticsData[0].platformVisitedFrom.other +
                  (userData.platformVisitedFrom.other ? 1 : 0),
            };
            const pageViewed =
              findThisMonthsAnalyticsData[0].pageViewed + pagesViewed;
            const updatedData = {
              dateMonthYearDate,
              liveVistors,
              newUsers,
              pageViewed,
              bouncedBackUsers,
              returningUsers,
              deviceType,
              platformVisitedFrom,
            };
            validatedVisitedUserDataDb.set(userId, {
              ...userData,
              dateVisited: pingCurrentTime,
            });
            const dataId = findThisMonthsAnalyticsData[0]._id;
            const updateThisMonthAnalytics =
              await analyticsData.findByIdAndUpdate(dataId, updatedData);
          }
        } catch (error) {
          console.log(
            `server error while trying to add/update analytics data :${error}`,
          );
        }
      }
      //
      addDataToAnalytics();
    });
  } catch (error) {
    console.log(error);
  }
}
io.on("connection", async (socket) => {
  try {
    console.log(`new user with socket id -> ${socket.id} connected`);
    AnalyticsSocketSection(socket);
    //StudentsSocketSection(socket);
  } catch (error) {
    console.log(error);
  }
});

module.exports = { sendFileEvents };
