const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { URL } = require("../models/db");
const port = process.env.PORT || 3000;
const hostname = `http://localhost:${port}`;

router.post("/api/shortenURL", async (req, res) => {
  const creationDate = new Date();
  const expirationDate = new Date(
    new Date(creationDate).setDate(creationDate.getDate() + 30)
  );

  const existingURL = await URL.findOne({
    originalURL: req.body.url,
  });

  if (existingURL !== null) {
    return res.send(hostname + "/" + existingURL.hash);
  }

  const encodedURL = crypto
    .createHash("sha256")
    .update(req.body.url)
    .digest("base64");
  const hash = encodedURL.substring(0, 7);

  try {
    await URL.create({
      hash: hash,
      originalURL: req.body.url,
      creationDate: creationDate,
      expirationDate: expirationDate,
    });
  } catch (error) {
    return res.send("Duplicate URL");
  }
  res.send(hostname + "/" + hash);
});

router.delete("/api/shortenURL", async (req, res) => {
  try {
    await URL.deleteOne({
      originalURL: req.body.url,
    });
    res.send("Deleted");
  } catch (error) {
    res.status(500).send("Failed to delete URL");
  }
});

module.exports = router;
