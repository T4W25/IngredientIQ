const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});