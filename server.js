const express = require("express");
const server = express();
require("dotenv").config();
const cors = require("cors");
server.use(
  cors({
    origin: [process.env.FRONTEND_URL_DEV, process.env.FRONTEND_URL],
  }),
);
server.use("/api/paystack/webhook", express.raw({ type: "application/json" }));
server.use(express.json());
const port = process.env.SERVER_PORT || 5000;
//
server.listen(port, () => {
  console.log(`server runing on port ${port}`);
});
//test
server.get("/", async (req, res) => {
  res.status(200).json({ ok: true });
});
//controllers
const registrationRouter = require("./controllers/registration");
const loginRouter = require("./controllers/login");
const paymentRouter = require("./controllers/payment");
const studentsDataRouter = require("./controllers/studentsData");
//use controllers
server.use("/register/user", registrationRouter);
server.use("/signin/user", loginRouter);
//server.use("/payment", paymentRouter);
server.use("/students/", studentsDataRouter);
