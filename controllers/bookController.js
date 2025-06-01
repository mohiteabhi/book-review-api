const Book = require('../models/Book');
const Review = require('../models/Review');

const createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author required' });
    }

    const bookId = await Book.create(title, author, genre);
    res.status(201).json({ id: bookId, title, author, genre });
  } catch (err) {
    res.status(500).json({ message: 'Error creating book' });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const books = await Book.getAll(limit, offset, req.query.author, req.query.genre);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books' });
  }
};

const getBookDetails = async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const averageRating = await Review.getAverageRating(req.params.id);
    book.averageRating = parseFloat(averageRating).toFixed(1);

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book details' });
  }
};

const searchBooks = async (req, res) => {
  try {
    const { q } = req.query; 
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const results = await Book.search(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
};

module.exports = { createBook, getAllBooks, getBookDetails, searchBooks };