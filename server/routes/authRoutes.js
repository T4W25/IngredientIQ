const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const userController = require('../controllers/userController');
const authorProfileController = require('../controllers/authorProfileController');
const userProfileController = require('../controllers/userProfileController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdir(uploadsDir, { recursive: true });  // Asynchronously create uploads directory if it doesn't exist

// Multer setup for file uploading with storage option
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  // Store file in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));  // Ensure unique filenames
  }
});

const allowedTypes = [
  'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image, PDF, or Word documents are allowed'), false);
    }
    cb(null, true);
  }
});


// Serve static files for uploads directory
router.use('/uploads', express.static(uploadsDir));  // Make the 'uploads' directory publicly accessible

// routes/auth.js
// Image upload route
router.post('/profile/user/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Create the URL for the image
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Log success
    console.log('Image uploaded successfully:', imageUrl);
    
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Something went wrong during the upload process',
      error: error.message 
    });
  }
});

// Document upload route
router.post('/profile/author/upload-documents', auth, upload.array('documents', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No documents uploaded' });
    }

    const documentUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    // Log success
    console.log('Documents uploaded successfully:', documentUrls);
    
    res.json({ documents: documentUrls });
  } catch (error) {
    console.error('Upload documents error:', error);
    res.status(500).json({ 
      message: 'Something went wrong during document upload',
      error: error.message 
    });
  }
});

// Other routes related to user and author
router.post('/register/user', userController.registerUser);
router.post('/register/author', authorController.registerAuthor);
router.post('/signin/user', userController.signInUser);
router.post('/signin/author', authorController.signInAuthor);
router.post('/signout/user', userController.signOutUser);
router.post('/signout/author', authorController.signOutAuthor);

// Profile related routes
router.patch('/profile/user', auth, userProfileController.updateUserProfile);
router.get('/profile/user', auth, userProfileController.getUserProfile);
router.get('/profile/author', auth, authorProfileController.getAuthorProfile);
router.patch('/profile/author', auth, authorProfileController.updateAuthorProfile);

module.exports = router;