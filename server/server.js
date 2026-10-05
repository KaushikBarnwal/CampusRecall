import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import itemRoutes from './routes/itemRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Lost and Found API is running smoothly' });
});

// Mount Routes
app.use('/api/items', itemRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
