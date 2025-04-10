const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader); // DEBUG

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // ✅ Extract token from "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded); // DEBUG
    req.user = { _id: decoded.id }; // ✅ Use correct field name
    next();
  } catch (err) {
    console.error('JWT Error:', err.message); // DEBUG
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = auth;
