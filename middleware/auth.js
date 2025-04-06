// middleware/auth.js - Authentication middleware
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'exploreindia-jwt-secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// routes/destinations.js - Destination routes
const express = require('express');
const router = express.Router();
const { Destination } = require('../models/Destination');
const auth = require('./auth');

// @route   GET api/destinations
// @desc    Get all destinations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/destinations/:id
// @desc    Get destination by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id).populate('experiences');
    
    if (!destination) {
      return res.status(404).json({ msg: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Destination not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/destinations
// @desc    Create a destination
// @access  Private (Admin only in real implementation)
router.post('/', auth, async (req, res) => {
  const { name, location, description, imageUrl, travelTips, bestTimeToVisit } = req.body;
  
  try {
    const newDestination = new Destination({
      name,
      location,
      description,
      imageUrl,
      travelTips: travelTips ? travelTips.split(',').map(tip => tip.trim()) : [],
      bestTimeToVisit
    });
    
    const destination = await newDestination.save();
    res.json(destination);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create similar routes for experiences, testimonials, and contact
// routes/experiences.js - Experience routes
// routes/testimonials.js - Testimonial routes
// routes/contact.js - Contact form routes
