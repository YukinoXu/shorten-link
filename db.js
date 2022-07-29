const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

mongoose.connect('mongodb://localhost:27017/express-auth', {
  
});

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: {
    type: String, 
    set(val) {
      return bcrypt.hashSync(val, saltRounds)
    } 
  }
})
const User = mongoose.model('User', UserSchema);

module.exports = { User };