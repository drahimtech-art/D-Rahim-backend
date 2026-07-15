const express = require("express");
const studentsDataRouter = express.Router();
const userData = require("../modules/studentUser");
const userConnections = require("../modules/userConnections.js");
const multer = require("multer");
const path = require("path");
const fsPromise = require("fs").promises;
//middlewares
const apiRequstValidation = require("../middlewares/apiValidation");
const userValidation = require("../middlewares/userValidation");
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
      const imageUrl = `http://${req.headers.host}/studentsProfileImages/${isImage.filename}`;
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
      const oldImageUrl = isUserInRecords.imageUrl;
      const updatedImage = isImage
        ? imageUrl
        : oldImageUrl
          ? oldImageUrl
          : null;
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
          imageUrl: updatedImage,
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
        imageUrl: updatedImage,
      });
      const updateUsersConnectionDataOfUser = await userConnections.updateMany(
        {
          contactId: isUserInRecords.connectionId,
        },
        {
          contactFirstName: firstName,
          contactLastName: lastName,
          contactImage: updatedImage,
        },
      );
      if (!updateData) throw new Error("Somting went wrong will updating user");
      const userInfo = {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        bio: bio,
        imageUrl: updatedImage,
      };
      res.status(200).json({
        ok: true,
        message: "User records updated",
        userInfo: userInfo,
      });
      if (isImage && oldImageUrl) {
        const imagePath = oldImageUrl.split(`http://${req.headers.host}/`)[1];
        await fsPromise
          .unlink(`storage/${imagePath}`)
          .then((e) => console.log(`successfuly deleted old image`))
          .catch((err) => console.log(`error while deleting old image`));
      }
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error : ${error}` });
      console.log(`server error : ${error}`);
    }
  },
);
module.exports = studentsDataRouter;
