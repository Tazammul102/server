const jwt = require("jsonwebtoken");
const isAuthenticated = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Please Enter A Valid Token " });
  } else {
    const data = jwt.verify(token, process.env.JWT_SERET_KEY);
    req.user = data.user;
    next();
  }
};
module.exports = isAuthenticated;
