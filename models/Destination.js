// models/Destination.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  experiences: [{
    type: Schema.Types.ObjectId,
    ref: 'Experience'
  }],
  travelTips: [String],
  bestTimeToVisit: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// models/Experience.js
const ExperienceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  destinations: [{
    type: Schema.Types.ObjectId,
    ref: 'Destination'
  }]
});

// models/Testimonial.js
const TestimonialSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  date: {
    type: Date,
    default: Date.now
  },
  approved: {
    type: Boolean,
    default: false
  }
});

// models/Contact.js
const ContactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  responded: {
    type: Boolean,
    default: false
  }
});

module.exports = {
  Destination: mongoose.model('Destination', DestinationSchema),
  Experience: mongoose.model('Experience', ExperienceSchema),
  Testimonial: mongoose.model('Testimonial', TestimonialSchema),
  Contact: mongoose.model('Contact', ContactSchema)
};