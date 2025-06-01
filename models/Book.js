const db = require('../config/db');

class Book {
  // method to create a new book with the given title, author, and genre.
  static create(title, author, genre) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO books (title, author, genre) VALUES (?, ?, ?)',
        [title, author, genre],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  // method to get all books with optional filters for author and genre, and pagination support.
  static getAll(limit, offset, author, genre) {
    let query = 'SELECT * FROM books';
    const params = [];
    
    if (author || genre) {
      query += ' WHERE';
      if (author) {
        query += ' author = ?';
        params.push(author);
      }
      if (genre) {
        if (author) query += ' AND';
        query += ' genre = ?';
        params.push(genre);
      }
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // methof to get a book by its ID.
  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  //method to search for books by title or author using a case-insensitive search.
static search(term) {
  return new Promise((resolve, reject) => {
    // Convert to lowercase for case-insensitive search
    const searchTerm = `%${term.toLowerCase()}%`;
    
    db.all(
      `SELECT * FROM books 
       WHERE LOWER(title) LIKE ? OR LOWER(author) LIKE ?`,
      [searchTerm, searchTerm],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
} 
}

module.exports = Book;