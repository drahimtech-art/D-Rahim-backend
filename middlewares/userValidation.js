const jwt = require("jsonwebtoken");

async function validateUser(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        ok: false,
        message: "access denied user not validated pls login",
      });
    const tokenData = await jwt.verify(token, process.env.ACCESS_TOKEN);
    if (!tokenData)
      return res
        .status(401)
        .json({ ok: false, message: "invalid session token pls login" });
    const tokenId = tokenData._id;
    res.tokenId = tokenId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: `server error : ${error}` });
  }
}
module.exports = validateUser;
