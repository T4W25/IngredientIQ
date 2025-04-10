const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Author = require('../models/Author');
require('dotenv').config();

const registerAuthor = async (req, res) => {
  const { username, email, password, role} = req.body;
  try {
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAuthor = new Author({ username, email, passwordHash, role: role || 'Contributor'});
    await newAuthor.save();

    res.status(201).json({ message: 'Author registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const signInAuthor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const author = await Author.findOne({ email });
    if (!author) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, author.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: author._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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