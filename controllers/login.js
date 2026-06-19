const express = require("express");
const loginRouter = express.Router();
const bcrypt = require("bcryptjs");
const userData = require("../database");
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
    const requst = await userData.find("email", email);
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
    if (isPasswordCorrect)
      return res
        .status(200)
        .json({ ok: true, message: "success", userId: requst[0]._id });
    res.status(401).json({ ok: false, message: "wrong password" });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error} ` });
  }
});
//
loginRouter.get("/validate/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId)
      return res
        .status(303)
        .json({ ok: false, message: "access denied invalide requst id" });
    const requst = await userData.find("_id", userId);
    if (requst.length === 0)
      return res.status(404).json({ ok: false, message: "no records found" });
    if (requst[0].role.code !== process.env.STUDENT_CODE)
      return res
        .status(303)
        .json({ ok: false, message: "access denied  user not verified" });
    res.status(200).json({ ok: true, message: "requst granted" });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error} ` });
  }
});
//
module.exports = loginRouter;
