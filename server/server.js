require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Secure Express apps by setting various HTTP headers

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', userRoutes);

// Image upload route (will be implemented later)
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));