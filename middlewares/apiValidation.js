async function apiRequstValidation(req, res, next) {
  try {
    const clientId = req.headers["x-frontend-key"];
    if (clientId !== process.env.CLIENT_KEY)
      return res
        .status(401)
        .json({ ok: false, message: "access denied client not verified" });
    next();
  } catch (error) {
    console.log(error);
  }
}
module.exports = apiRequstValidation;
