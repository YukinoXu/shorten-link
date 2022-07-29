const { User } = require('./db');
const express = require('express');
const bcrypt = require('bcrypt')

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

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
    res.sendStatus(401);
    return;
  }
  
  const credentialValid = bcrypt.compareSync(req.body.password, user.password)
  if (!credentialValid) {
    res.sendStatus(401);
  }
  res.send(user);
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
