const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection string
const mongoURI = 'mongodb+srv://yalbayat:p8XXnX22Y8CSKBPr@cluster0.ggpsj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
