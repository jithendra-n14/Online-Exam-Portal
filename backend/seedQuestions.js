require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./model/Question");

const MONGO_URI = process.env.MONGO_URI;

const seedQuestions = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected for seeding...");

    // Sample questions
    const questions = [
      {
        topic: "Math",
        difficulty: "Easy",
        question: "What is 2 + 2?",
        options: ["2", "3", "4", "5"],
        correct: "4",
      },
      {
        topic: "Math",
        difficulty: "Easy",
        question: "What is 5 - 3?",
        options: ["1", "2", "3", "4"],
        correct: "2",
      },
      {
        topic: "Science",
        difficulty: "Medium",
        question: "What planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        correct: "Mars",
      },
      {
        topic: "History",
        difficulty: "Hard",
        question: "Who was the first President of the United States?",
        options: ["George Washington", "Abraham Lincoln", "John Adams", "Thomas Jefferson"],
        correct: "George Washington",
      },
    ];

    await Question.deleteMany(); // Clear old data
    await Question.insertMany(questions);

    console.log("✅ Sample questions seeded successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding questions:", err);
    mongoose.disconnect();
  }
};

seedQuestions();
