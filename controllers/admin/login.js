const express = require("express");
const loginRouter = express.Router();
const jwt = require("jsonwebtoken");
loginRouter.post("/login", async (req, res) => {});

module.exports = loginRouter;
