// config/db.js - Database configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exploreindia', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

// utils/validators.js - Input validation utilities
const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(password);
};

const sanitizeInput = (input) => {
  // Basic sanitization
  if (typeof input === 'string') {
    return input.trim().replace(/<[^>]*>?/gm, '');
  }
  return input;
};

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput
};

// utils/errorHandler.js - Error handling middleware
const errorResponse = (message, statusCode = 500) => {
  return {
    status: 'error',
    statusCode,
    message
  };
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('Error:', err);
    res.status(500).json(errorResponse('Server Error'));
  });

module.exports = {
  errorResponse,
  asyncHandler
};