const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');

const getStorageFolder = (type) => {
  switch (type) {
    case 'profile': return 'uploads/profiles/';
    case 'recipe': return 'uploads/recipes/';
    default: return 'uploads/misc/';
  }
};

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.query.type || 'misc';
    const folder = getStorageFolder(type);

    fs.mkdirSync(folder, { recursive: true }); // ensure folder exists
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
  }
}).single('image');

// Upload Handler
const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const relativePath = file.path.replace(/\\/g, '/'); // for Windows path support
    
    // Verify the file was actually saved
    if (!fs.existsSync(file.path)) {
      return res.status(500).json({ error: 'File was not saved successfully' });
    }

    res.status(200).json({ url: `/${relativePath}` });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message,
      code: error.code
    });
  }
};

router.post('/image', auth, upload, handleFileUpload);

// Serve images
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = router;