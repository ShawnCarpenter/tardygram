const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  profilePhotoUrl;
  passwordHash;
  


  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.profilePhotoUrl = row.profile_photo_url;
    this.passwordHash = row.password_hash;
  }

  static async insert(user) {
    const { rows } = await pool.query(`
    INSERT INTO users (email, profile_photo_url, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *`, [user.email, user.profilePhotoUrl, user.passwordHash]);
    return new User(rows[0]);
  }

  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if(!rows[0]) return null;
    else return new User(rows[0]);
  }
  
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      profilePhotoUrl: this.profilePhotoUrl
    };
  }
};
