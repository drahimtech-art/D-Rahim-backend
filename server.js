const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const cors = require("cors");
const cookieparesr = require("cookie-parser");
const SocketConnection = require("./controllers/socket");
app.use(cookieparesr());
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL_DEV, process.env.FRONTEND_URL],
    credentials: true,
  }),
);
//
SocketConnection(server);
const moongose = require("mongoose");
app.use("/api/paystack/webhook", express.raw({ type: "application/json" }));
const port = process.env.SERVER_PORT || 5000;
//
moongose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("database up and runing");
    server.listen(port, () => {
      console.log(`server runing on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
//test
app.get("/", async (req, res) => {
  res.status(200).json({ ok: true });
});

//controllers
const registrationRouter = require("./controllers/registration");
const loginRouter = require("./controllers/login");
const paymentRouter = require("./controllers/payment");
const studentsDataRouter = require("./controllers/studentsData");
const connnectionRouter = require("./controllers/connectionsAndChat");
const connectionsRouter = require("./controllers/connectionsAndChat");
//use controllers
app.use("/register/user", registrationRouter);
app.use("/signin/user", loginRouter);
//app.use("/payment", paymentRouter);
app.use("/students/", studentsDataRouter);
app.use("/connection", connectionsRouter);
