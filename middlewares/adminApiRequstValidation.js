const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function adminApiRequstValidation(req, res, next) {
  try {
    const clientId = req.headers["x-frontend-key"];
    if (clientId !== process.env.ADMIN_CODE)
      return res
        .status(401)
        .json({ ok: false, message: "access denied client not verified" });
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        ok: false,
        message: "access denied admin not validated pls login",
      });
    const tokenData = await jwt.verify(token, process.env.ADMIN_TOKEN);
    if (!tokenData)
      return res
        .status(401)
        .json({ ok: false, message: "invalid session token pls login" });
    const tokenId = tokenData._id;
    res.tokenId = tokenId;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ ok: false, message: "invalid session token pls login" });
  }
}
module.exports = adminApiRequstValidation;
