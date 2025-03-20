const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const searchbarRoutes = require('./routes/searchbarRoutes');
const mealPlanRoutes = require('./routes/mealPlanRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = 'mongodb+srv://anshlimbachiya88:Limbachiya%40Ansh@ingredientiq.xngyb.mongodb.net/?retryWrites=true&w=majority&appName=IngredientIQ';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('Failed to connect to MongoDB:', err));


app.use('/api/auth', authRoutes);
app.use('/api',searchbarRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/recipes', recipeRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

