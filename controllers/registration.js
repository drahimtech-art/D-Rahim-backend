const express = require("express");
const registrationRouter = express.Router();
const bcrypt = require("bcryptjs");
const userData = require("../modules/studentUser");
const userFeedsLeaingData = require("../modules/feeds/userLearningData/userLearningData");
const connectionsRequst = require("../modules/connectionsRequst.js");
const { randomUUID } = require("crypto");
//
const apiRequstValidation = require("../middlewares/apiValidation");
//middle ware
const requstBodyValidation = async (req, res, next) => {
  //email validation
  function validateEmail(e) {
    if (typeof e !== "string") return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(e.trim());
  }
  //
  function dateOfBirthFormatValidation(d) {
    const date = d.split("/");
    if (date.length !== 3) return false;
    const month = date[0];
    const day = date[1];
    const year = date[2];
    if (
      month.split("").length === 2 &&
      day.split("").length === 2 &&
      year.split("").length === 4
    )
      return true;
    return false;
  }
  function phoneNumberValidation(n) {
    const phoneNumber = n.split("");
    if (phoneNumber.length !== 11) return false;
    return true;
  }
  try {
    const body = req.body;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const dateOfBirth = body.dateOfBirth;
    const password = body.password;
    const phoneNumber = body.phoneNumber;
    const email = body.email;
    const bio = body.bio;
    if (!body)
      return res
        .status(400)
        .json({ ok: false, message: "invalid requst body" });
    if (
      !password ||
      !email ||
      !phoneNumber ||
      !lastName ||
      !firstName ||
      !dateOfBirth ||
      !bio
    )
      return res
        .status(400)
        .json({ ok: false, message: "invalid requst body" });
    if (!dateOfBirthFormatValidation(dateOfBirth))
      return res
        .status(400)
        .json({ ok: false, message: "invalid requst body, invalid date" });
    const isEmailValid = validateEmail(email);
    if (!isEmailValid)
      return res.status(400).json({
        ok: false,
        message: "invalid requst, email address is not valid",
      });
    if (!phoneNumberValidation(phoneNumber))
      return res.status(400).json({
        ok: false,
        message: "invalid requst, phone number is in valid expected 11 digits",
      });
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof phoneNumber !== "string" ||
      typeof dateOfBirth !== "string" ||
      typeof bio !== "string"
    )
      return res.status(400).json({
        ok: false,
        message: "invalid body requst data type isent of type required ",
      });
    next();
  } catch (error) {
    res.status(500).json({ ok: true, message: `Server error: ${error}` });
  }
};
registrationRouter.post(
  "/",
  apiRequstValidation,
  requstBodyValidation,
  async (req, res) => {
    const body = req.body;
    const password = body.password;
    const phoneNumber = body.phoneNumber;
    const bio = body.bio;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const isEmailFound = await userData.find({ email: body.email });
      if (isEmailFound.length !== 0)
        return res
          .status(403)
          .json({ ok: false, massage: "email already exist with records" });
      const connectionId = randomUUID();
      const createUser = new userData({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        dateOfBirth: body.dateOfBirth,
        password: hashedPassword,
        phoneNumber: body.phoneNumber,
        bio: body.bio,
        connectionId: connectionId,
        imageUrl: null,
        role: {
          code: process.env.STUDENT_CODE,
          type: "students",
        },
        mentorshipPlan: "basic",
      });
      const addUser = await createUser.save();
      if (!addUser) throw new Error(addUser);
      const creatUserFeedsLearingData = new userFeedsLeaingData({
        connectionId: addUser.connectionId,
        userId: addUser._id,
        mediaIntaractions: {
          hashTags: [],
          connectionsMedia: [],
          globalConnectionsMedia: [],
          createdAt: new Date(),
        },
      });
      const saveUserLeaingData = await creatUserFeedsLearingData.save();
      const createFriendRequstStorage = new connectionsRequst({
        userId: addUser._id,
        connectionId: addUser.connectionId,
        requst: [],
        createdAt: new Date(),
      });
      const saveCreatedFriendRequstStorage =
        await createFriendRequstStorage.save();
      res.status(201).json({ ok: true, message: "succesfull" });
    } catch (error) {
      res.status(200).json({ ok: false, message: `server error: ${error} ` });
      console.log(`server error: ${error} `);
    }
  },
);

module.exports = registrationRouter;
