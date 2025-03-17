const bcrypt = require('bcryptjs');
const Author = require('../models/Author');

// Update author profile
const updateAuthorProfile = async (req, res) => {
  const { email, password, bio, profilePicture, verificationDocuments } = req.body;
  const authorId = req.user.id;

  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found' });

    if (email) author.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      author.passwordHash = await bcrypt.hash(password, salt);
    }
    if (bio) author.bio = bio;
    if (profilePicture) author.profilePicture = profilePicture;
    if (verificationDocuments) author.verificationDocuments = verificationDocuments;

    await author.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateAuthorProfile
};