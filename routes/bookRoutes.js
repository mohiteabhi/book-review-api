/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management endpoints
 */
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { createBook, getAllBooks, getBookDetails, searchBooks } = require('../controllers/bookController');


/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 example: Wings of Fire
 *               author:
 *                 type: string
 *                 example: APJ Abdul Kalam
 *               genre:
 *                 type: string
 *                 example: Biography
 *     responses:
 *       201:
 *         description: Book created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, createBook);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *     responses:
 *       200:
 *         description: List of books
 *       500:
 *         description: Server error
 */
router.get('/', getAllBooks);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books by title or author
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matched books
 *       400:
 *         description: Query required
 *       500:
 *         description: Server error
 */
router.get('/search', searchBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book details by ID (with average rating and paginated reviews)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Review page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of reviews per page
 *     responses:
 *       200:
 *         description: Book details with reviews
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getBookDetails);

module.exports = router;