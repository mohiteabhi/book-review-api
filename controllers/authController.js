const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// signup: Validate input, check for existing user, hash password, inserts it into DB
const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const userId = await User.create(username, password);
    res.status(201).json({ id: userId, username });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

// login: Validate input, check credentials, generate JWT token for 1hr
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { signup, login };