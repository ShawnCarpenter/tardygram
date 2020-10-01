const chance = require('chance').Chance();
const Comment = require('../lib/models/comment');
const Post = require('../lib/models/post');
const UserService = require('../lib/services/user-service');



module.exports = async({ userCount = 5, postCount = 100, commentCount = 200 } = {}) => {
  const users = await Promise.all([...Array(userCount)].map((_, i) => {
    return UserService.create({
      email: `email${i}@domain.com`,
      password: `password${i}`,
      profilePhotoUrl: chance.url({ extensions: ['gif', 'jpg', 'png'] })
    });
  }));

  const posts = await Promise.all([...Array(postCount)].map(() => {
    return Post.insert({
      userId: chance.pickone(users).id,
      photoUrl: chance.url({ extensions: ['gif', 'jpg', 'png'] }),
      caption: chance.sentence(),
      tags:[...Array(chance.integer({ min:1, max:4 }))].map(() => chance.word())
    });

  }));

  await Promise.all([...Array(commentCount)].map(() => {
    return Comment.insert({
      commentBy: chance.pickone(users).id,
      postId: chance.pickone(posts).id,
      comment: chance.sentence()
    });
  }));
};
