const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader); // DEBUG

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  console.log('Token:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded); // DEBUG

    // Add additional user details to the request object if needed
    req.user = { _id: decoded.id, id: decoded.id, email: decoded.email, role: decoded.role };

    next();
  } catch (err) {
    console.error('JWT Error:', err.message); // DEBUG

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please login again' });
    }

    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = auth;