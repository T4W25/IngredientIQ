const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Author = require('../models/Author');
require('dotenv').config();

const registerAuthor = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields (username, email, password) are required' });
  }

  try {
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAuthor = new Author({ username, email, passwordHash, role: role || 'Contributor' });
    await newAuthor.save();

    const token = jwt.sign(
      {
        id: newAuthor._id,
        email: newAuthor.email,
        role: newAuthor.role || 'Author'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ message: 'Author registered successfully', token });    
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const signInAuthor = async (req, res) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required' });
  }

  try {
    const author = await Author.findOne({ email });
    if (!author) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, author.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: author._id,
        email: author.email,
        role: author.role || 'Author' // include role in token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );    
    res.json({ token, author: { id: author._id, email: author.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const signOutAuthor = (req, res) => {
  res.json({ message: 'Sign out successful' });
};

module.exports = {
  registerAuthor,
  signInAuthor,
  signOutAuthor
};