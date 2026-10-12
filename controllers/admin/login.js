const express = require("express");
const loginRouter = express.Router();
const randomUUID = require("crypto").randomUUID();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminProfileData = require("../../modules/admin/adminProfile");
//
const adminSessionTokens = loginRouter.post("/login", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    if (!body)
      return res.status(404).json({
        ok: false,
        message: "invalid requst body one or two filed are missing",
      });
    if (!body.password || !body.email)
      return res.status(404).json({
        ok: false,
        message: "invalid requst body one or two filed are missing",
      });
    const adminData = await adminProfileData.find();
    const password = body.password;
    const email = body.email;
    const isEmailCorrect = await bcrypt.compare(email, adminData[0].email);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      adminData[0].password,
    );
    if (!isEmailCorrect)
      return res
        .status(400)
        .json({ ok: false, message: "access denied enter a valid email" });
    if (!isPasswordCorrect)
      return res
        .status(400)
        .json({ ok: false, message: "access denied enter a valid password" });
    const SESSION_TOKEN_ID = jwt.sign(
      { email: adminData[0].email, _id: adminData[0]._id },
      process.env.ADMIN_TOKEN,
    );
    res.cookie("token", SESSION_TOKEN_ID, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 2 * 60 * 60 * 1000, //2 hours
    });
    res.status(200).json({
      ok: true,
      message: "login successfull",
      adminApiKey: process.env.ADMIN_CODE,
    });
  } catch (error) {
    console.log(`server error in login section : ${error}`);
    res.status(500).json({ ok: false, message: `server error : ${error}` });
  }
});

module.exports = loginRouter;
