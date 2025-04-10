const bcrypt = require('bcryptjs');
const User = require('../models/User');
//Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username, // Changed from name to username to match model
      email: user.email,
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { username, email, bio, profilePicture, currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    // ✅ Password logic
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getUserProfile,
  updateUserProfile
};