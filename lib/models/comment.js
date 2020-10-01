const pool = require('../utils/pool');

module.exports = class Comment {
  id;
  commentBy;
  postId;
  comment;

  constructor(row) {
    this.id = row.id;
    this.commentBy = row.comment_by;
    this.postId = row.post_id;
    this.comment = row.comment;
  }
  
  static async insert(comment) {
    const { rows } = await pool.query(`
    INSERT INTO comments (comment_by, post_id, comment)
    VALUES ($1, $2, $3) RETURNING *
    `, [comment.commentBy, comment.postId, comment.comment]);
    return new Comment(rows[0]);
  }
};
