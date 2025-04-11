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
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS setup for allowing frontend access
app.use(cors({
  origin: "https://ingredient-iq.onrender.com",  // ✅ Allow frontend URL
  methods: "GET,POST,PATCH,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection string
const mongoURI = 'mongodb+srv://anshlimbachiya88:Limbachiya%40Ansh@ingredientiq.xngyb.mongodb.net/?retryWrites=true&w=majority&appName=IngredientIQ';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Setup file upload with multer
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({
  dest: 'uploads/',  // Directory for storing uploaded files
  limits: { fileSize: 50 * 1024 * 1024 },  // Max file size: 50MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
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


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});
