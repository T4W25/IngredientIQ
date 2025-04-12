const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Regex for validating email format
const emailValidator = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const authorSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [emailValidator, 'Please provide a valid email address'], // Email format validation
  },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePicture: { 
    type: String, 
    default: '', 
    validate: {
      validator: function (value) {
        // Allow empty, relative path (/uploads/...) or full URL (http/https)
        return (
          !value ||
          value.startsWith('/uploads/') ||
          /^https?:\/\/.+/.test(value)
        );
      },
      message: 'Invalid URL for profile picture'
    }    
  },
  role: { 
    type: String, 
    enum: ['Contributor', 'Chef'], 
    default: 'Contributor'
  },
  isVerified: { type: Boolean, default: false },
  verificationDocuments: [{
    type: String,
    validate: {
      validator: function(value) {
        return (
          !value ||
          value.startsWith('/uploads/') ||
          /^https?:\/\/.+/.test(value)
        );
      },
      message: 'Invalid URL for verification document'
    }
  }],
  verificationStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for fast lookups on email and username
authorSchema.index({ email: 1 });
authorSchema.index({ username: 1 });

module.exports = mongoose.model('Author', authorSchema);