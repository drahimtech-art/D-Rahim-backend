const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcryptjs");

loginRouter.get("/signin/user");
