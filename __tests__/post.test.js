
const { getAgent } = require('../data/data-helpers');
const request = require('supertest');
const app = require('../lib/app');
const Comment = require('../lib/models/comment');


describe('post routes', () => {
  it('creates an image post with a POST URL', async() => {
    const response = await getAgent()
      .post('/api/v1/posts')
      .send({
        photoUrl: 'https://placekitten.com/300/300',
        caption: 'words and stuff',
        tags:['cute', 'adorable murder machine']
      });
    expect(response.body).toEqual({
      id:expect.any(String),
      userId:expect.any(String),
      photoUrl: 'https://placekitten.com/300/300',
      caption: 'words and stuff',
      tags:['cute', 'adorable murder machine']
    });
  });
  it('gets a list of all posts using GET', async() => {
    
    const posts = await request(app).get('/api/v1/posts');
    expect(posts.body).toEqual(expect.arrayContaining([{
      id:expect.any(String),
      userId:expect.any(String),
      photoUrl: expect.any(String),
      caption: expect.any(String),
      tags:expect.any(Array)
    }]));
  });
  it('gets a post by Id', async() => {
    const response = await getAgent()
      .get('/api/v1/posts/1');
    expect(response.body).toEqual({
      id: '1',
      userId:expect.any(String),
      photoUrl:expect.any(String),
      caption:expect.any(String),
      tags:expect.any(Array),
      user:expect.any(String),
      comments:expect.arrayContaining([{
        id:expect.any(Number),
        commentBy:expect.any(Number),
        postId:expect.any(Number),
        comment:expect.any(String),
      }])
    });
  });
  // ('updates a post with patch', async() => {
  //   const newPost = await getAgent()
  //     .post('/api/v1/posts')
  //     .send({
  //       photoUrl: 'https://placekitten.com/300/300',
  //       caption: 'words and stuff',
  //       tags:['cute', 'adorable murder machine']
  //     });
  //   console.log(newPost.body);
  //   const response = await getAgent()
  //     .patch(`/api/v1/posts/${newPost.id}`)
  //     .send({ caption:'new stuff' });
  //   expect(response.body).toEqual({ ...newPost.body, caption: 'new stuff' });
  // });
});
