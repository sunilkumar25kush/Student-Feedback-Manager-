const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON data
app.use(express.static('public')); // Serve static HTML files from 'public' folder

// MongoDB Connection
mongoose.connect('mongodb+srv://sunil:1ogwCTvn31VAlpSP@first-backend.9jnkact.mongodb.net/studentFeedbackDB')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// Mongoose Schema & Model
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// ==========================================
// ROUTES (The Flow of Data)
// ==========================================

// 1. POST Route: Save Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const newFeedback = new Feedback({ name, rating, comment });
    await newFeedback.save(); // Save to MongoDB
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// 2. GET Route: Fetch All Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 }); // Get all from MongoDB
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});