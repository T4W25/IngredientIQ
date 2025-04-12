const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailValidator = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [emailValidator, 'Please provide a valid email address']
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  bio: { 
    type: String, 
    default: '' 
  },
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
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);