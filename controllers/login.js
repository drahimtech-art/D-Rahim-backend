const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcryptjs");
const userData = require("../modules/studentUser");
const jwt = require("jsonwebtoken");
//middlewares
const userValidation = require("../middlewares/userValidation");
//api middlewares
const apiValidation = require("../middlewares/apiValidation");
//
/*
passwords :
1: 12345,
2: 54321
3: 5421
*/
async function hashPassword(password) {
  const requst = await bcrypt.hash(password, 10);
  const result = requst;
  return result;
}

//body middleware
function validateReqBody(req, res, next) {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  if (!email || !password)
    return res.status(400).json({ ok: false, message: "invalide requst body" });
  function validateEmail(e) {
    if (typeof e !== "string") return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(e.trim());
  }
  const isEmailValid = validateEmail(email);
  if (!isEmailValid)
    return res.status(400).json({
      ok: false,
      message: "invalide requst, email address is not valid",
    });
  next();
}
loginRouter.post("/", validateReqBody, async (req, res) => {
  try {
    const body = req.body;
    const email = body.email;
    const password = body.password;
    const requst = await userData.find({ email: email });
    if (requst.length === 0)
      return res.status(404).json({ ok: false, message: "No records found" });
    if (requst[0].role.code !== process.env.STUDENT_CODE)
      return res
        .status(403)
        .json({ ok: false, message: "access denied user not verified" });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      requst[0].password,
    );
    if (isPasswordCorrect) {
      const tokenData = {
        email: requst[0].email,
        _id: requst[0]._id,
      };
      const token = await jwt.sign(tokenData, process.env.ACCESS_TOKEN, {
        expiresIn: "30d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 30, //up untill 30 days(a month)
      });
      return res.status(200).json({
        ok: true,
        message: "success",
        clientKey: process.env.CLIENT_KEY,
      });
    }
    res.status(401).json({ ok: false, message: "wrong password" });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error} ` });
  }
});
//
loginRouter.get(
  "/validate/",
  apiValidation,
  userValidation,
  async (req, res) => {
    const tokenId = res.tokenId;
    try {
      const requst = await userData.find({ _id: tokenId });
      if (requst.length === 0) {
        res.clearCookie("token");
        return res.status(404).json({ ok: false, message: "no records found" });
      }
      if (requst[0].role.code !== process.env.STUDENT_CODE)
        return res.status(403).json({
          ok: false,
          message: "access denied user permissions not verified",
        });
      const respondsData = {
        firstName: requst[0].firstName,
        lastName: requst[0].lastName,
        email: requst[0].email,
        dateOfBirth: requst[0].dateOfBirth,
        phoneNumber: requst[0].phoneNumber,
        bio: requst[0].bio,
        connectionId: requst[0].connectionId,
        imageUrl: requst[0].imageUrl,
      };
      res
        .status(200)
        .json({ ok: true, message: "requst granted", userInfo: respondsData });
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error} ` });
    }
  },
);
//
loginRouter.get("/logout", apiValidation, userValidation, async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ ok: true, message: "logout successful" });
});
//
module.exports = loginRouter;
