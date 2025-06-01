const db = require('../config/db');

class Review {
  // Static methods for review operations. Creates a new review with the given book ID, user ID, rating, and comment.
  static create(bookId, userId, rating, comment) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [bookId, userId, rating, comment],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  // Static method to get all reviews with optional pagination and filtering by book ID.
  static getByBookId(bookId, limit, offset) {
    return new Promise((resolve, reject) => {
      db.all(
        `
        SELECT
          reviews.*,
          users.username,
          books.title AS bookTitle
        FROM reviews
        JOIN users ON reviews.user_id = users.id
        JOIN books ON reviews.book_id = books.id
        WHERE reviews.book_id = ?
        LIMIT ? OFFSET ?
        `,
        [bookId, limit, offset],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  //update a review by its ID with the new rating and comment.
  static update(id, rating, comment) {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE reviews 
        SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
        [rating, comment, id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  //delete a review by its ID.
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM reviews WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  // Static method to get a review by its book_id.
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM reviews WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Static method to get the average rating for a book by its ID.
  static getAverageRating(bookId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT AVG(rating) as averageRating FROM reviews WHERE book_id = ?',
        [bookId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row?.averageRating || 0);
        }
      );
    });
  }
}

module.exports = Review;