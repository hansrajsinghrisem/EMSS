import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js'; // Added import
import Task from './models/task.js';
import User from './models/user.js';
import TaskStatusUpdate from './models/taskStatusUpdate.js';
import LeaveRequest from './models/leaveRequest.js'; // Added import

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', leaveRoutes); // Added leave routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch(err => console.error('❌ DB connection error:', err));