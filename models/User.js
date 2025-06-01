const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Static methods for user operations. Creates a new user with the given username and password and returns the ID and username.
  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  // Static method to find a user by ID. Returns the user object or null if not found.
  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = User;