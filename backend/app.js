// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const quotationRoutes = require('./routes/quotations');
const productRoutes = require('./routes/products');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect('mongodb+srv://harshshrimali3003:1234567890@cluster0.nequwhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0interiorDesignerDB')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/quotations', quotationRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;