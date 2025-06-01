const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { createReview, getReviews, updateReview, deleteReview } = require('../controllers/reviewController');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book review management endpoints
 */

/**
 * @swagger
 * /books/{id}/reviews:
 *   post:
 *     summary: Submit a review for a book
 *     description: |
 *       Submit a review for a specific book.
 *       - Requires authentication
 *       - One review per user per book
 *       - Rating must be between 1-5
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the book to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 (poor) to 5 (excellent)
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Optional review comment
 *                 example: "This book changed my perspective on life!"
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the created review
 *                 bookId:
 *                   type: integer
 *                 rating:
 *                   type: integer
 *                 comment:
 *                   type: string
 *       400:
 *         description: Invalid input (e.g., missing rating)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user not authorized)
 *       409:
 *         description: Conflict (user already reviewed this book)
 *       500:
 *         description: Internal server error
 */
router.post('/books/:id/reviews', authenticate, createReview);

/**
 * @swagger
 * /books/{id}/reviews:
 *   get:
 *     summary: Get reviews for a book
 *     description: Retrieve paginated reviews for a specific book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the book
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   book_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get('/books/:id/reviews', getReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     description: Update your own review. Only the review owner can update it.
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Updated rating (1-5)
 *                 example: 4
 *               comment:
 *                 type: string
 *                 description: Updated comment
 *                 example: "Still a great book after second reading"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review updated successfully"
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user doesn't own the review)
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.put('/reviews/:id', authenticate, updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Delete your own review. Only the review owner can delete it.
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (user doesn't own the review)
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.delete('/reviews/:id', authenticate, deleteReview);

module.exports = router;