const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const envPath = fs.existsSync(path.join(__dirname, ".env"))
  ? path.join(__dirname, ".env")
  : path.join(__dirname, "../.env");
require("dotenv").config({ path: envPath });

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

console.log("Mongo URI loaded:", process.env.MONGO_URI ? "YES" : "NO");

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

// 1. POST: Save feedback (CREATE)
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

// 2. GET: Fetch all feedback (READ)
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

// 3. PUT: Update an existing feedback by ID (UPDATE)
app.put("/api/feedback/:id", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Mongoose query method matching by MongoDB _id
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true } // {new: true} se updated data return hota hai
    );

    if (!updatedFeedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.status(200).json({
      message: "Feedback updated successfully!",
      updatedFeedback
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

// 4. DELETE: Delete a feedback by ID (DELETE)
app.delete("/api/feedback/:id", async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!deletedFeedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.status(200).json({
      message: "Feedback deleted successfully!"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Vercel deployment ke liye
module.exports = app;