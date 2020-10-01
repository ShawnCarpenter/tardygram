const pool = require('../utils/pool');
const Comment = require('./comment');

module.exports = class Post {
  id;
  userId;
  PhotoUrl;
  caption;
  tags;
  


  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.photoUrl = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
  }

  static async insert(post) {
    const { rows } = await pool.query(`
    INSERT INTO posts (user_id, photo_url, caption, tags)
      VALUES ($1, $2, $3, $4)
      RETURNING *`, [post.userId, post.photoUrl, post.caption, post.tags]);
    return new Post(rows[0]);
  }
  static async find(){
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows.map(post => new Post(post));
  }

  static async findById(postId){
    const { rows } = await pool.query(`SELECT 
    users.email, posts.*, array_to_json(array_agg(comments.*)) AS comments
  FROM posts
  JOIN users ON posts.user_id = users.id
  JOIN comments ON posts.id = comments.post_id
  where posts.id=$1
  GROUP BY users.email, posts.id`, [postId]);
    const foundPost =  {
      ...new Post(rows[0]),
      user: rows[0].email,
      comments:rows[0].comments.map(comment => new Comment(comment)) };
    console.log(foundPost);
    return foundPost;
  }
};
