const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// Создайте новую викторину (POST /user/quizdb/quizzes)
router.post("/", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получите все ответы на викторины (GET /user/quizdb/quizzes)
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получите конкретный тест по идентификатору (GET /user/quizdb/quizzes/:id)
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Проверьте ответы на тест (POST /user/quizdb/quizzes/:id/check-answers)
router.post("/:id/check-answers", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const userAnswers = req.body.answers;
    const results = [];
    let score = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect =
        JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);

      if (isCorrect) {
        score++;
      }

      results.push({
        questionId: question._id,
        questionText: question.text,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      });
    });

    const percentage = (score / quiz.questions.length) * 100;

    res.json({
      quizId: quiz._id,
      quizTitle: quiz.title,
      totalQuestions: quiz.questions.length,
      correctAnswers: score,
      percentage,
      results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить тест (PUT /user/quizdb/quizzes/:id)
router.put("/:id", async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Удалить тест (DELETE /user/quizdb/quizzes/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получите все вопросы для викторины (GET /user/quizdb/quizzes/:id/questions)
router.get("/:id/questions", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz.questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Задать конкретный вопрос (GET /user/quizdb/quizzes/:quizId/questions/:questionId)
router.get("/:quizId/questions/:questionId", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = quiz.questions.id(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
