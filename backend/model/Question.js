const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  topic: { type: String, required: true }, // e.g., "Math"
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard"], 
    required: true 
  },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correct: { type: String, required: true }
});

module.exports = mongoose.model("Question", questionSchema);
