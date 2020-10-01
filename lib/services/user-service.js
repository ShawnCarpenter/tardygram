const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const create = async({ email, profilePhotoUrl, password }) => {
  const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  return User.insert({ email, profilePhotoUrl, passwordHash });
};

const makeToken = user => {
  const token = jwt.sign(user.toJSON(), process.env.APP_SECRET, {
    expiresIn: '5d'
  });
  return token;
};

const authorize = async({ email, password }) => {
  const user = await User.findByEmail(email);
  if(!user) throw new Error('Invalid email/password');
  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
  if(!passwordsMatch) throw new Error('Invalid email/password');

  return user;
};

const verifyToken = token => {
  const user = jwt.verify(token, process.env.APP_SECRET);
  return user;
};

module.exports = {
  create,
  makeToken, 
  authorize,
  verifyToken
};
