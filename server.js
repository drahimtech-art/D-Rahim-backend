const express = require("express");
const server = express();
//require("dotenv").config();
const cors = require("cors");
server.use(
  cors({
    origin: ["http://localhost:5173/"],
  }),
);
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

//use controllers
server.use("/register/user", registrationRouter);
