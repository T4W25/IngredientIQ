// server/models/Author.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' }, // URL or file path
  role: { type: String, enum: ['Contributor', 'Chef'], default: 'Contributor'},
  isVerified: { type: Boolean, default: false },
  verificationDocuments: [{ type: String }], // URLs or file paths
}, {
  timestamps: true
});

module.exports = mongoose.model('Author', authorSchema);
