// server/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { compressImage } = require('../utils/imageCompression');

// Middleware to handle file upload
const handleFileUpload = async (req, res, next) => {
  try {
    const file = req.files.image;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size should be less than 5MB' });
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG and JPG are allowed.' });
    }

    const base64Image = `data:${file.mimetype};base64,${file.data.toString('base64')}`;
    const compressedImage = await compressImage(base64Image);
    res.json({ url: compressedImage });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

router.post('/image', handleFileUpload);

module.exports = router;