const express = require("express");
const adminRouter = express.Router();

adminRouter.get("/requst/validate", async (req, res) => {
  try {
    res.status(200).json({ ok: true, message: "admin successful" });
  } catch (error) {
    console.log(`server error in admin requst validation section : ${error}`);
    res.status(500).json({ ok: false, message: `server error : ${error}` });
  }
});

module.exports = adminRouter;
