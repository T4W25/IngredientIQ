const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');
const searchbarRoutes = require('./routes/searchbarRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require("cors");
const moderatorRoutes = require('./routes/moderatorRoutes');

// Load environment variables from .env file
require('dotenv').config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 10000;

// CORS setup for allowing frontend access
const allowedOrigins = [
  "http://localhost:5173",            // local frontend (Vite)
  "http://localhost:3000",            // optional: React default port
  "https://ingredient-iq.onrender.com" // deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PATCH,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true // ✅ IMPORTANT for cookies/auth headers
}));

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection string
const mongoURI = process.env.MONGO_URI;  // Use the environment variable

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Stop the server if DB connection fails
  }
};

// Invoke MongoDB connection
connectDB();

// Setup file upload with multer
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const allowedTypes = [
  'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only images, PDFs, and Word documents are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter
});

// Serve static files (for image uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', searchbarRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/moderator', moderatorRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Image upload route using multer
app.post('/api/profile/user/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    console.log('File uploaded:', req.file); // ✅ Check file object

    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error); // ✅ Log full error stack
    return res.status(500).json({ error: error.message || 'Something went wrong during upload' });
  }
});

// Error handling middleware for 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});