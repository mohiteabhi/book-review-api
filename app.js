// Load environment variables from .env
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const setupSwagger = require('./swagger'); 

// Middleware
app.use(express.json());


app.use('/auth', require('./routes/authRoutes')); //authentication-related routes to '/auth' path
app.use('/books', require('./routes/bookRoutes')); // book-related -> '/books' path
app.use('/', require('./routes/reviewRoutes')); //review-related routes to root path

setupSwagger(app); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});