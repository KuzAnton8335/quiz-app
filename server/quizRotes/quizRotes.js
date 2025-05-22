const express = require("express");
const Quiz = require("../models/Quiz");

const router = express.Router();

// получеам все вопросы
router.get("/questions", async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// добавить новый вопрос
router.post("/questions", async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  try {
    const newQuestion = new Quiz({ question, options, answer });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: "Error saving question" });
  }
});

// Проверить ответ
router.post("/check-answer", async (req, res) => {
  const { id, userAnswer } = req.body;

  try {
    const question = await Quiz.findById(id);
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const isCorrect = question.answer === userAnswer;
    res.json({ correct: isCorrect });
  } catch (err) {
    res.status(500).json({ message: "Error checking answer" });
  }
});

module.exports = router;
