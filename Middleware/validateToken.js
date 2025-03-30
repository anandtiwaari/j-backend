const jwt = require("jsonwebtoken");
const validateToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded, "show what it is........");
  req.userId = decoded.userId;
  next();
};

module.exports = validateToken;
