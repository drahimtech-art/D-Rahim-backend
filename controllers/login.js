const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcryptjs");
const userData = require("../modules/studentUser");
const jwt = require("jsonwebtoken");
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
    return res.status(403).json({ ok: false, message: "invalide requst body" });
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
        .status(303)
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
      return res.status(200).json({ ok: true, message: "success" });
    }
    res.status(401).json({ ok: false, message: "wrong password" });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error} ` });
  }
});
//
loginRouter.get("/validate/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(403).json({
        ok: false,
        message: "access denied user not validated pls login",
      });
    const tokenData = await jwt.verify(token, process.env.ACCESS_TOKEN);
    if (!tokenData)
      return res
        .status(403)
        .json({ ok: false, message: "invalied session token pls login" });
    const requst = await userData.find({ _id: tokenData._id });
    if (requst.length === 0)
      return res.status(404).json({ ok: false, message: "no records found" });
    if (requst[0].role.code !== process.env.STUDENT_CODE)
      return res
        .status(303)
        .json({ ok: false, message: "access denied  user not verified" });
    const respondsData = {
      firstName: requst[0].firstName,
      lastName: requst[0].lastName,
      email: requst[0].email,
      dateOfBirth: requst[0].dateOfBirth,
    };
    res
      .status(200)
      .json({ ok: true, message: "requst granted", userInfo: respondsData });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error} ` });
  }
});
//
module.exports = loginRouter;
