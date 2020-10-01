const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Post = require('../models/post');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post
      .insert({ ...req.body, userId:req.user.id })
      .then(post => res.send(post))
      .catch(next);
      
  })
  
  .get('/', (req, res, next) => {
    Post
      .find()
      .then(posts => res.send(posts))
      .catch(next);
  })
  
  .get('/:id', (req, res, next) => {
    Post
      .findById(req.params.id)
      .then(posts => res.send(posts))
      .catch(next);
  });
  
