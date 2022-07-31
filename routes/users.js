const express = require("express");
const router = express.Router();
const { User } = require("../models/db");
const { auth } = require("../middlewares/auth");

router.get("/api/users/profile", auth, async (req, res) => {
  res.send({
    username: req.user.username,
    email: req.user.email,
  });
});

router.get("/api/users", async (req, res) => {
  const users = await User.find({});
  const resp = users.map((user) => {
    return {
      username: user.username,
      email: user.email,
      creationDate: user.creationDate,
    };
  });
  res.send(resp);
});

router.post("/api/users", async (req, res) => {
  const currentDate = new Date();
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      creationDate: currentDate,
    });
    res.send({
      username: user.username,
      email: user.email,
      creationDate: user.creationDate,
    });
  } catch (err) {
    return res
      .status(400)
      .send("Failed to register, the username already exists");
  }
});

module.exports = router;
