const Review = require('../models/Review');

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.id;
    const userId = req.user.userId;

    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }

    const reviewId = await Review.create(bookId, userId, rating, comment);
    res.status(201).json({ id: reviewId, bookId, rating, comment });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ message: 'User already reviewed this book' });
    }
    res.status(500).json({ message: 'Error creating review' });
  }
};

const getReviews = async (req, res) => {
  try {
    const bookId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const reviews = await Review.getByBookId(bookId, limit, offset);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const review = await Review.getById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this review' });
    }

    await Review.update(reviewId, rating, comment);
    res.json({ message: 'Review updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating review' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;

    const review = await Review.getById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' });
    }

    await Review.delete(reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};

module.exports = { createReview, getReviews, updateReview, deleteReview };