const Author = require('../models/Author');
const mongoose = require('mongoose');

// Get all pending verifications
exports.getPendingVerifications = async (req, res) => {

  // if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
  //   return res.status(403).json({ message: 'Forbidden - You do not have permission to approve authors' });
  // }

  try {
    const pendingAuthors = await Author.find({ 
      verificationStatus: 'pending',
      verificationDocuments: { $exists: true, $ne: [] }
    }).select('username email role verificationDocuments createdAt');
    
    res.json({ pendingAuthors });
  } catch (err) {
    console.error('Error in getPendingVerifications:', err);
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
};

// Approve verification
exports.approveAuthor = async (req, res) => {
  const { authorId } = req.params;

  // Authorization check (admin or moderator)
  // if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
  //   return res.status(403).json({ message: 'Forbidden - You do not have permission to approve authors' });
  // }

  // Validate authorId
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ message: 'Invalid author ID' });
  }

  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found' });

    author.isVerified = true;
    author.verificationStatus = 'approved';
    author.rejectionReason = ''; // Clear any previous rejection reason
    await author.save();

    res.json({ message: 'Author approved and verified successfully' });
  } catch (err) {
    console.error('Error in approveAuthor:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reject verification
exports.rejectAuthor = async (req, res) => {
  const { authorId } = req.params;
  const { reason } = req.body;

  // Authorization check (admin or moderator)
  // if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
  //   return res.status(403).json({ message: 'Forbidden - You do not have permission to reject authors' });
  // }

  // Validate authorId
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ message: 'Invalid author ID' });
  }

  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found' });

    author.isVerified = false;
    author.verificationStatus = 'rejected';
    author.rejectionReason = reason || 'No reason provided';
    await author.save();

    res.json({ message: 'Author verification rejected successfully' });
  } catch (err) {
    console.error('Error in rejectAuthor:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
