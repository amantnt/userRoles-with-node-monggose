const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(403).send({ message: "Token not get" });
  }
  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECCET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).send({ message: "Invalid or expired token" });
  }
};

const checkRole = (roles) => async (req, res, next) => {
  const { name, role } = req.user;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Sorry, you do not have access to this route" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { verifyToken, checkRole };
