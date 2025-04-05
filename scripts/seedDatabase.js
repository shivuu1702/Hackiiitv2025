// scripts/seedDatabase.js - Populate database with initial data

const mongoose = require('mongoose');
const { Destination, Experience, Testimonial } = require('../models/Destination');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/exploreindia', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const destinations = [
  {
    name: 'Taj Mahal',
    location: 'Agra',
    description: 'A symbol of eternal love, this magnificent marble mausoleum is one of the seven wonders of the world.',
    imageUrl: '/images/destinations/taj-mahal.jpg',
    rating: 4.8,
    travelTips: [
      'Visit early morning to avoid crowds',
      'Closed on Fridays',
      'Hire a local guide for rich history',
      'Carry water bottles'
    ],
    bestTimeToVisit: 'October to March'
  },
  {
    name: 'Pink City',
    location: 'Jaipur',
    description: 'Explore the majestic forts and palaces of this colorful city known for its rich royal heritage.',
    imageUrl: '/images/destinations/jaipur.jpg',
    rating: 4.6,
    travelTips: [
      'Visit Amer Fort in the morning',
      'Shop for handicrafts in local markets',
      'Try local Rajasthani cuisine'
    ],
    bestTimeToVisit: 'November to February'
  },
  {
    name: 'Varanasi',
    location: 'Uttar Pradesh',
    description: 'One of the oldest continuously inhabited cities in the world, experience spiritual awakening on the banks of the sacred Ganges.',
    imageUrl: '/images/destinations/varanasi.jpg',
    rating: 4.5,
    travelTips: [
      'Attend the Ganga Aarti at Dashashwamedh Ghat',
      'Take a boat ride during sunrise',
      'Respect local customs and traditions'
    ],
    bestTimeToVisit: 'November to March'
  }
];

const experiences = [
  {
    title: 'Culinary Journey',
    description: 'Taste the diverse flavors of India with authentic regional cuisines that will tantalize your taste buds.',
    category: 'Food',
    icon: '🍛'
  },
  {
    title: 'Wildlife Safari',
    description: 'Embark on thrilling safaris to spot tigers, elephants, and other exotic wildlife in their natural habitat.',
    category: 'Adventure',
    icon: '🏞'
  },
  {
    title: 'Yoga Retreats',
    description: 'Find inner peace and rejuvenate your mind, body, and soul at serene yoga and meditation retreats.',
    category: 'Wellness',
    icon: '🧘'
  },
  {
    title: 'Bazaar Shopping',
    description: 'Explore vibrant markets filled with handicrafts, textiles, spices, and unique souvenirs.',
    category: 'Shopping',
    icon: '🛍'
  }
];

const testimonials = [
  {
    text: 'My journey through Rajasthan was absolutely magical. The forts, palaces, and warm hospitality of the locals made it an unforgettable experience.',
    author: 'Sarah Johnson',
    country: 'USA',
    rating: 5,
    approved: true
  },
  {
    text: 'The spiritual experience in Varanasi changed my life. The ancient rituals and the energy of the place is something everyone should experience once in their lifetime.',
    author: 'Marco Rossi',
    country: 'Italy',
    rating: 5,
    approved: true
  },
  {
    text: 'From the bustling streets of Delhi to the serene backwaters of Kerala, India offered me a perfect blend of chaos and calm. Will definitely come back!',
    author: 'Emma Thompson',
    country: 'UK',
    rating: 4,
    approved: true
  }
];

// Admin user
const adminUser = {
  name: 'Admin',
  email: 'admin@exploreindia.com',
  password: 'adminPassword123', // Will be hashed
  profileImage: '/images/admin-profile.jpg'
};

// Seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await Destination.deleteMany({});
    await Experience.deleteMany({});
    await Testimonial.deleteMany({});
    await User.deleteMany({ email: adminUser.email });

    // Seed experiences
    const savedExperiences = await Experience.insertMany(experiences);
    console.log(`${savedExperiences.length} experiences seeded`);

    // Add experience IDs to destinations
    const destinationsWithExperiences = destinations.map(dest => {
      // Randomly assign 2 experiences to each destination
      const randomExperiences = savedExperiences
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(exp => exp._id);
      
      return {
        ...dest,
        experiences: randomExperiences
      };
    });

    // Seed destinations
    const savedDestinations = await Destination.insertMany(destinationsWithExperiences);
    console.log(`${savedDestinations.length} destinations seeded`);

    // Seed testimonials
    const savedTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`${savedTestimonials.length} testimonials seeded`);

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    const admin = new User({
      ...adminUser,
      password: hashedPassword
    });
    
    await admin.save();
    console.log('Admin user created');

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();