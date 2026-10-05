import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify if item is LOST or FOUND'],
      enum: ['LOST', 'FOUND'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Electronics', 'Personal Items', 'Wallets', 'Keys', 'Documents', 'Clothing', 'Bags', 'Accessories', 'Other'],
      default: 'Other',
    },
    location: {
      type: String,
      required: [true, 'Please provide the location'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide the date'],
    },
    contact: {
      type: String,
      required: [true, 'Please provide contact information'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'PENDING', 'CLAIMED', 'RESOLVED'],
      default: 'OPEN',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    isGeoTagged: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      name: { type: String, default: 'Anonymous' },
      email: { type: String, default: '' },
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    claims: [
      {
        claimantName: { type: String, default: 'Anonymous' },
        claimantContact: { type: String, default: '' },
        proofDetails: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add text indexing for fast search by title, location, or description
itemSchema.index({ title: 'text', location: 'text', description: 'text' });

const Item = mongoose.model('Item', itemSchema);

export default Item;
