const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
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

app.use(cors({
  origin: "http://localhost:5173",  // ✅ Allow frontend URL
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max-file-size
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

app.use('/api/auth', authRoutes);
app.use('/api',searchbarRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
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

app.use('/api/moderator', moderatorRoutes);