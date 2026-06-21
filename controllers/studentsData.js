const express = require("express");
const studentsDataRouter = express.Router();
const userData = require("../modules/studentUser");
//middlewares
const apiRequstValidation = require("../middlewares/apiValidation");
const userValidation = require("../middlewares/userValidation");
const validateReqBody = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body)
      return res
        .status(400)
        .json({ ok: false, message: "invalid requst body" });
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const dateOfBirth = req.body.dateOfBirth;
    const phoneNumber = req.body.phoneNumber;
    const bio = req.body.bio;
    if (!firstName || !lastName || !dateOfBirth || !phoneNumber || !bio)
      return res
        .status(400)
        .json({ ok: false, message: "invalid requst body" });
    next();
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error : ${error}` });
    console.log(error);
  }
};
//
studentsDataRouter.post(
  "/update/user/info",
  apiRequstValidation,
  userValidation,
  validateReqBody,
  async (req, res) => {
    const userId = res.tokenId;
    try {
      const body = req.body;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const dateOfBirth = req.body.dateOfBirth;
      const phoneNumber = req.body.phoneNumber;
      const bio = req.body.bio;
      const isUserInRecords = await userData.findById(userId);
      if (!isUserInRecords) {
        res.clearCookie("token");
        return res.status(404).json({ ok: false, message: "No records Found" });
      }
      const oldFirstName = isUserInRecords.firstName;
      const oldLastName = isUserInRecords.lastName;
      const oldPhoneNumber = isUserInRecords.phoneNumber;
      const oldDateOfBirth = isUserInRecords.dateOfBirth;
      const oldBio = isUserInRecords.bio;
      if (
        oldFirstName === firstName &&
        oldLastName === lastName &&
        oldPhoneNumber === phoneNumber &&
        oldBio === bio &&
        oldDateOfBirth === dateOfBirth
      ) {
        const userInfo = {
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          phoneNumber: phoneNumber,
          bio: bio,
        };
        return res.status(303).json({
          ok: true,
          message: "details not modified cause requst & records are the same",
          userInfo: userInfo,
        });
      }
      const updateData = await userData.findByIdAndUpdate(userId, {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        bio: bio,
      });
      if (!updateData) throw new Error("Somting went wrong will updating user");
      const userInfo = {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        bio: bio,
      };
      res.status(200).json({
        ok: true,
        message: "User records updated",
        userInfo: userInfo,
      });
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error : ${error}` });
      console.log(`server error : ${error}`);
    }
  },
);
module.exports = studentsDataRouter;
