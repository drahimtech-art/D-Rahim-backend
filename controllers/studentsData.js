const express = require("express");
const studentsDataRouter = express.Router();
const userData = require("../modules/studentUser");
const multer = require("multer");
const path = require("path");
//middlewares
const apiRequstValidation = require("../middlewares/apiValidation");
const userValidation = require("../middlewares/userValidation");
/*
const validateReqBody = async (bodyData, req, res) => {
  //console.log(res);
  return;
  try {
    const body = bodyData;
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
    return true;
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error : ${error}` });
    console.log(error);
    return false;
  }
};
*/
//multer middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./storage/studentsProfileImages");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadMiddleware = multer({ storage: storage });
//
studentsDataRouter.put(
  "/update/user/info",
  apiRequstValidation,
  userValidation,
  uploadMiddleware.single("profile-image"),
  async (req, res) => {
    //console.log(req);
    try {
      //middleware
      const body = JSON.parse(req.body.data);
      const userId = res.tokenId;
      if (!body)
        return res
          .status(400)
          .json({ ok: false, message: "invalid requst body" });
      const firstName = body.firstName;
      const lastName = body.lastName;
      const dateOfBirth = body.dateOfBirth;
      const phoneNumber = body.phoneNumber;
      const bio = body.bio;
      if (!firstName || !lastName || !dateOfBirth || !phoneNumber || !bio)
        return res
          .status(400)
          .json({ ok: false, message: "invalid requst body" });
      //
      const isImage = req.file;
      const imageUrl = `http://localhost:5000/studentsProfileImages/${isImage && isImage.filename}`;
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
        oldDateOfBirth === dateOfBirth &&
        !isImage
      ) {
        const userInfo = {
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          phoneNumber: phoneNumber,
          bio: bio,
          imageUrl: isImage ? imageUrl : null,
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
        imageUrl: isImage ? imageUrl : null,
      });
      if (!updateData) throw new Error("Somting went wrong will updating user");
      const userInfo = {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        bio: bio,
        imageUrl: isImage ? imageUrl : null,
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
