const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const examRoutes = require("./routes/examRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use("/api/exam", examRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

module.exports = app;
