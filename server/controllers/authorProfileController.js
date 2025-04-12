const bcrypt = require('bcryptjs');
const Author = require('../models/Author');

// Update author profile
const updateAuthorProfile = async (req, res) => {
  const { email, password, bio, profilePicture, verificationDocuments } = req.body;
  const authorId = req.user.id;

  // Validation to ensure that at least one field is provided
  if (!email && !password && !bio && !profilePicture && !verificationDocuments) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found' });

    // Check if the email is being updated and ensure it's unique
    if (email) {
      const existingAuthor = await Author.findOne({ email });
      if (existingAuthor && existingAuthor._id !== authorId) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      author.email = email;
    }

    // Password hashing if updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      author.passwordHash = await bcrypt.hash(password, salt);
    }

    if (bio) author.bio = bio;
    if (profilePicture) author.profilePicture = profilePicture;

    // Handle verification documents
    if (verificationDocuments && verificationDocuments.length > 0) {
      author.verificationDocuments = verificationDocuments;
      author.verificationStatus = 'pending'; // submitted for review
      author.isVerified = false;
    }

    await author.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update Author Profile Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAuthorProfile = async (req, res) => {
  try {
    const author = await Author.findById(req.user._id).select("-passwordHash");
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.json({
      id: author._id,
      username: author.username,
      email: author.email,
      bio: author.bio || "",
      profilePicture: author.profilePicture || "",
      role: author.role,
      isVerified: author.isVerified,
      createdAt: author.createdAt
    });
  } catch (err) {
    console.error('Error in getAuthorProfile:', err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  updateAuthorProfile,
  getAuthorProfile
};