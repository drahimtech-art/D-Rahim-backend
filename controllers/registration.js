const express = require("express");
const registrationRouter = express.Router();
const bcrypt = require("bcryptjs");
//
registrationRouter.get("/", async (req, res) => {
  res.status(200).json({ ok: true });
});

module.exports = registrationRouter;
