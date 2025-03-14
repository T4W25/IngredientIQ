// server/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' }, // URL or file path
}, {
  timestamps: true  // Automatically creates createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
