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
## Installation & Setup
### Clone the Repository
