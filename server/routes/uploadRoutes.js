const express = require('express');
const router = express.Router();
const multer = require('multer');  // Add multer to handle file upload
const auth = require('../middleware/authMiddleware');
const { compressImage } = require('../utils/imageCompression');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware to handle file upload and compression
const handleFileUpload = async (req, res, next) => {
  try {
    const file = req.file;  // Access the file using `req.file` for single file upload

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size should be less than 5MB' });
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG and JPG are allowed.' });
    }

    const imageUrl = `/uploads/${file.filename}`;  // Directly use the file path for the image URL
    res.json({ url: imageUrl });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

// POST route to handle file upload
router.post('/image', auth, upload.single('image'), handleFileUpload);

module.exports = router;
