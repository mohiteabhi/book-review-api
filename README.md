# book-review-api
Mini Assignment: Book Review API (Node.js) 
---

## Project Overview
This API allows users to:

- **Register** and **login** (JWT-based authentication).
- **Create**, **list**, and **search** books.
- **Submit**, **view**, **update**, and **delete** reviews on books. Each user can submit exactly one review per book.
- All routes (except listing and searching books) require a valid JWT token in the `Authorization` header.
---

## Prerequisites

- **Node.js** (version ≥ 14.x)
- **npm** (version ≥ 6.x)
- **SQLite3** (installed on your machine, but the project will create and manage its own `.db` file)
- (Optional) **curl** for testing API endpoints.

---
# Installation & Setup
### Clone the Repository
```bash
git clone https://github.com/mohiteabhi/book-review-api.git
cd book-review-api
```
### Install Dependencies
```bash
npm install
```
##### This will install:
- express 
- sqlite3
- dotenv
- bcryptjs
- jsonwebtoken
- swagger-ui-express
- swagger-jsdoc

### Environment Variables:
Create a file named `.db` in the project root with the following contents:
```bash
JWT_SECRET=<your_randomly_generated_secret_here>
PORT=3000
```
- `JWT_SECRET`: Used to sign and verify JWT tokens. Replace `<your_jwt_secret_here>` with a secure, random string.
- `PORT`: Port on which the server will listen. Defaults to `3000` if not set.
---

## Running Locally
1. Ensure `.env` is in place.
2. From the project root, run:
```bash
node app.js
```
3. You should see:
```bash
Connected to SQLite database
Server running on port 3000
```
4. Open a browser and navigate to:
[http://localhost:3000/api-docs](URL)
5. Now You can Test the API
---

## Example API requests:
 You can easily test API in swagger by visiting [http://localhost:3000/api-docs](URL). In that create User using Signin then login the to generate the token then use that token in Authorize box at the top in swagger-docs and Authorize the user and test the API Points.
 
 ---
 ## Design Decisions & Assumptions:
 1. #### SQLite as the Database:
    - Chosen for simplicity and zero configuration.
    - Database file (bookreviews.db) lives in project root.
    - For production or concurrent writes, SQLite can be replaced with PostgreSQL or MySQL.
2. #### JWT for Authentication:
    - Stateless authentication.
    - Token expires after 1 hour.
    - All protected routes check Authorization: Bearer <<`token`>>
    - JWT_SECRET is loaded via .env
3. #### Password Hashing:
    - Uses `bcryptjs` with salt rounds = 10.
    - Plaintext passwords are never stored.

4. #### Unique Constraint on Reviews
    - Ensures each user can only submit one review per book.
    - Handled in Review.create(...). If a duplicate INSERT is attempted, SQLite throws a UNIQUE constraint failed error—caught in the controller and translated into HTTP 409 Conflict.

5. ####Pagination:
    - Default page size = 10 for books, = 5 for reviews.
    - Simple LIMIT ? OFFSET ? pattern for queries.
    - Clients control page via ?page= and ?limit=.
6. #### Swagger / OpenAPI Documentation
    - All route handlers include JSDoc block comments with @swagger.
    - swagger.js (in project root) configures swagger-jsdoc and swagger-ui-express to serve documentation at /api-docs.

7. #### Error Handling:
    - A global error handler in app.js logs the stack to console and returns a generic 500 Internal Server Error JSON response.
    - Controllers check for invalid input (e.g., missing fields, out-of-range rating) and return appropriate 4xx statuses.

---
## Schema Diagram (ER)

# Database Schema

## Tables

### 1. `users`

| Column     |
|------------|
| id         |
| username   |
| password   |
| created_at |

---

### 2. `books`

| Column     |
|------------|
| id         |
| title      |
| author     |
| genre      |
| created_at |

---

### 3. `reviews`

| Column      |
|-------------|
| id          |
| book_id     |
| user_id     |
| rating      |
| comment     |
| created_at  |
| updated_at  |


## Relationships

- **`reviews.book_id`** → `books.id`
- **`reviews.user_id`** → `users.id`
