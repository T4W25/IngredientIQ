const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/searchbarRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = 'mongodb+srv://yalbayat:p8XXnX22Y8CSKBPr@cluster0.ggpsj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('Failed to connect to MongoDB:', err));


app.use('/api/auth', authRoutes);
app.use('/api',recipeRoutes);


// Example route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

