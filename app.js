const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;

const { User } = require('./db');

app.use(cors());
app.use(express.json())
app.use('/', express.static('public'));

app.get('/api/users', async (req, res) => {
  const users = await User.find({})
  res.send(users);
});

app.post('/api/register', async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send(user);
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  });
  if (!user) {
    return res.status(401).send(`User '${req.body.username}' does not exists!`);
  }
  
  const credentialValid = bcrypt.compareSync(req.body.password, user.password)
  if (!credentialValid) {
    return res.status(401).send('Invalid credential!');
  }

  const token = jwt.sign({
    id: String(user._id),
  }, process.env.SECRET);

  res.send({
    user,
    token: token
  });
});

const auth = async (req, res, next) => {
  const token = String(req.headers.authorization).split(' ').pop();
  try {
    const { id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(id);
    next();
  } catch (error) {
    return res.status(401).send('Invalid token')
  }
}

app.get('/api/profile', auth, async (req, res) => {
  res.send({
    username: req.user.username
  });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
