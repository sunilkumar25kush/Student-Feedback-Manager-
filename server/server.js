const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Mongoose Schema
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose Model
const Feedback = mongoose.model("Feedback", feedbackSchema);

// POST: Save feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    const newFeedback = new Feedback({
      name,
      rating,
      comment,
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to submit feedback",
    });
  }
});

// GET: Fetch all feedback
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch feedbacks",
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Vercel deployment ke liye
module.exports = app;