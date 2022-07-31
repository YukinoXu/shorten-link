const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models/db");

router.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(401).send(`User '${req.body.username}' does not exists!`);
  }

  const credentialValid = bcrypt.compareSync(req.body.password, user.password);
  if (!credentialValid) {
    return res.status(401).send("Invalid credential!");
  }

  const token = jwt.sign(
    {
      id: String(user._id),
    },
    process.env.SECRET
  );

  res.send({
    username: user.username,
    email: user.email,
    token: token,
  });
});

module.exports = router;
