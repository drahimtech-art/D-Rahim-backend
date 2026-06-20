const express = require("express");
const registrationRouter = express.Router();
const bcrypt = require("bcryptjs");
const userData = require("../modules/studentUser");
//
registrationRouter.post("/", async (req, res) => {
  const body = req.body;
  const password = body.password;
  console.log(body);
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const isEmailFound = await userData.find({ email: body.email });
    if (isEmailFound.length !== 0)
      return res
        .status(403)
        .json({ ok: false, massage: "email already exist with records" });
    const createUser = new userData({
      firstName: "Victory",
      lastName: "Nwanoruo",
      email: body.email,
      dateOfBirth: "14/07/2004",
      password: hashedPassword,
      role: {
        code: process.env.STUDENT_CODE,
        type: "students",
      },
    });
    const adduser = await createUser.save();
    res
      .status(201)
      .json({ ok: true, message: "succesfull", userData: adduser });
  } catch (error) {
    res.status(200).json({ ok: false, message: `server error: ${error} ` });
  }
});

module.exports = registrationRouter;
