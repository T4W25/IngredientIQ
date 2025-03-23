const bcrypt = require('bcryptjs');
const User = require('../models/User');
//Get User Profile
const getUserProfile = async (req, res) => {
  const userId = req.user.id; 

  try {
    const user = await User.findById(userId).select("-passwordHash"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { email, password, bio, profilePicture } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};