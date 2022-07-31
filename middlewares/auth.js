const jwt = require("jsonwebtoken");
const { User } = require("../models/db");

const auth = async (req, res, next) => {
  const token = String(req.headers.authorization).split(" ").pop();
  try {
    const { id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(id);
    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};

module.exports = { auth };
