const express = require("express");
const Question = require("../model/Question");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Result = require("../model/Result");


// Start exam - fetch random questions without correct answers
router.get("/start", async (req, res) => {
  try {
    const { topic, difficulty } = req.query;

    if (!topic || !difficulty) {
      return res.status(400).json({ message: "Topic and difficulty are required" });
    }

    // Fetch random 30 questions
    const questions = await Question.aggregate([
      { $match: { topic, difficulty } },
      { $sample: { size: 30 } },
      {
        $project: {
          topic: 1,
          difficulty: 1,
          question: 1,
          options: 1,
          // ❌ hide correct answer
        },
      },
    ]);

    res.json({ topic, difficulty, questions });
  } catch (err) {
    console.error("Error fetching exam questions:", err);
    res.status(500).json({ message: "Error fetching exam questions" });
  }
});

// Submit exam answers
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { topic, difficulty, answers } = req.body;
    const userId = req.user.id;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers are required" });
    }

    let score = 0;
    const evaluatedAnswers = [];

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);

      if (!question) continue;

      const isCorrect = question.correct === ans.selected;
      if (isCorrect) {
        score += Math.round(100 / answers.length); // evenly distribute marks
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selected: ans.selected,
        isCorrect
      });
    }

    // Save result
    const result = new Result({
      user: userId,
      topic,
      difficulty,
      answers: evaluatedAnswers,
      score
    });

    await result.save();

    res.status(201).json({
      message: "Exam submitted successfully. Results will be available after 24 hours.",
      resultId: result._id
    });
  } catch (err) {
    console.error("Error submitting exam:", err);
    res.status(500).json({ message: "Error submitting exam" });
  }
});

// Fetch exam result (only after 2 minutes for testing)
router.get("/result/:id", authMiddleware, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate("user", "name email");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Check time difference
    const now = new Date();
    const diffMs = now - result.submittedAt; // in ms
    const diffMinutes = diffMs / (1000 * 60);

   if (diffMinutes < 2) {
  return res.status(403).json({
    message: `Result will be available after 2 minutes. Please wait ${Math.ceil(2 - diffMinutes)} minute(s).`
  });
}
console.log("Now:", now);
console.log("Submitted:", result.submittedAt);
console.log("Diff (minutes):", diffMinutes);

    res.json({
      user: result.user,
      topic: result.topic,
      difficulty: result.difficulty,
      score: result.score,
      submittedAt: result.submittedAt,
      answers: result.answers
    });
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ message: "Error fetching result" });
  }
});


module.exports = router;
