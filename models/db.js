const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

mongoose.connect("mongodb://localhost:27017/shorten-link", {});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: {
    type: String,
    set(val) {
      return bcrypt.hashSync(val, saltRounds);
    },
  },
  email: { type: String, unique: true },
  creationDate: { type: Date },
  lastLogin: { type: Date },
});
const User = mongoose.model("User", UserSchema);

const URLSchema = new mongoose.Schema({
  hash: { type: String, unique: true },
  originalURL: { type: String, unique: true },
  creationDate: { type: Date },
  expriationDate: { type: Date },
  userId: { type: mongoose.ObjectId },
});
const URL = mongoose.model("URL", URLSchema);

module.exports = { User, URL };
