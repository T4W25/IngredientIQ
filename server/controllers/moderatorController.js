const Author = require('../models/Author');

// Approve verification
exports.approveAuthor = async (req, res) => {
  const { authorId } = req.params;
  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found' });

    author.isVerified = true;
    author.verificationStatus = 'approved';
    author.rejectionReason = '';
    await author.save();

    res.json({ message: 'Author approved and verified' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Reject verification
exports.rejectAuthor = async (req, res) => {
  const { authorId } = req.params;
  const { reason } = req.body;

  try {
    const author = await Author.findById(authorId);
    if (!author) return res.status(404).json({ message: 'Author not found' });

    author.isVerified = false;
    author.verificationStatus = 'rejected';
    author.rejectionReason = reason || 'No reason provided';
    await author.save();

    res.json({ message: 'Author verification rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all pending verifications
exports.getPendingVerifications = async (req, res) => {
  try {
    const pendingAuthors = await Author.find({ verificationStatus: 'pending' });
    res.json(pendingAuthors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending verifications' });
  }
};