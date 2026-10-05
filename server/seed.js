import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';

dotenv.config();

const sampleItems = [
  {
    title: 'Black HP Laptop Bag',
    category: 'Electronics',
    type: 'LOST',
    location: 'Library Reading Room, 2nd Floor',
    date: '2026-08-28',
    description: 'Black HP bag containing a spiral notebook, blue pen, and a Logitech wireless mouse.',
    contact: 'student1@pccoe.org',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    coordinates: { lat: 18.6517, lng: 73.762 },
    isGeoTagged: true,
  },
  {
    title: 'Blue Stainless Steel Water Bottle',
    category: 'Personal Items',
    type: 'FOUND',
    location: 'MCA Lab 3, Desk 4',
    date: '2026-08-29',
    description: 'Milton 750ml blue steel bottle left beside workstation #12.',
    contact: 'lab_assistant@pccoe.org',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60',
    coordinates: { lat: 18.6522, lng: 73.7612 },
    isGeoTagged: true,
  },
  {
    title: 'College ID Card & Lanyard',
    category: 'Documents',
    type: 'FOUND',
    location: 'College Canteen Billing Counter',
    date: '2026-08-30',
    description: 'Found near the juice counter. Can be claimed from the Canteen Helpdesk after showing proof.',
    contact: 'canteen_desk@pccoe.org',
    status: 'CLAIMED',
    imageUrl: '',
    coordinates: { lat: 18.6508, lng: 73.7615 },
    isGeoTagged: true,
  },
  {
    title: 'Wireless Earbuds with Case',
    category: 'Electronics',
    type: 'LOST',
    location: 'Main Auditorium, Row F',
    date: '2026-09-02',
    description: 'White earbud charging case with a small astronaut sticker on top.',
    contact: 'aditya.k@gmail.com',
    status: 'OPEN',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
    coordinates: { lat: 18.6511, lng: 73.7624 },
    isGeoTagged: false,
  },
  {
    title: 'Two Door Keys with Marvel Keychain',
    category: 'Keys',
    type: 'FOUND',
    location: 'Basketball Court Bench',
    date: '2026-09-03',
    description: 'Silver brass keys with an Iron Man miniature keychain.',
    contact: 'sports_dept@college.edu',
    status: 'RESOLVED',
    imageUrl: '',
    coordinates: { lat: 18.653, lng: 73.7628 },
    isGeoTagged: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    await Item.deleteMany({});
    console.log('Cleared existing items.');
    await Item.insertMany(sampleItems);
    console.log(`Successfully seeded ${sampleItems.length} items with images, statuses, and geo-tags!`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();
