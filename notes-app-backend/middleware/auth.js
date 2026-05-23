const jwt = require("jsonwebtoken");

function auth(req, res, next) {

  const token =
    req.header("Authorization");

  if (!token) {
    return res.json({
      message: "Access Denied"
    });
  }

  try {

    const verified =
      jwt.verify(
        token,
        "mySecretKey"
      );

    req.user = verified;

    next();

  } catch (error) {

    res.json({
      message: "Invalid Token"
    });
  }
}

module.exports = auth;