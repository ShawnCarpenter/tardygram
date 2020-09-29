const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const UserService = require('../services/user-service');

const FIVE_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 5;

const attachCookie = (user, res) => {

  const token = UserService.makeToken(user);
  res.cookie('session', token, {
    maxAge: FIVE_DAYS_IN_MS,
    httpOnly: true,
    sameSite: 'none'
  });
};


module.exports = Router()
  .post('/signup', (req, res, next) => {
    UserService
      .create(req.body)
      .then(user => {
        attachCookie(user, res);
        res.send(user);
      })
      .catch(next);
  })
  .post('/login', (req, res, next) => {
    UserService
      .authorize(req.body)
      .then(user => {
        attachCookie(user, res);
        res.send(user);
      })
      .catch(next);
  })
  .get('/verify', ensureAuth, (req, res) => {
    console.log(`REQ: ${req}, RES:${res}`);
    res.send(req.user);
  });
