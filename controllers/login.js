const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcryptjs");

//
loginRouter.post("/", async (req, res) => {
  const body = req.body;
  res.status(200).json({ ok: true, message: "success", userId: "8322z4t" });
});

//
module.exports = loginRouter;
