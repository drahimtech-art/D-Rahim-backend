const express = require("express");
const homeRouter = express.Router();

homeRouter.get("/ourwork/projectlist", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
  }
});

module.exports = homeRouter;
