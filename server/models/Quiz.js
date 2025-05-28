const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
  is_correct: { type: Boolean, required: true },
});

const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question_text: { type: String, required: true },
  question_type: {
    type: String,
    required: true,
    enum: ["single_choice", "multiple_choice", "text_answer", "numeric_answer"],
  },
  options: {
    type: [OptionSchema],
    required: function () {
      return (
        this.question_type === "single_choice" ||
        this.question_type === "multiple_choice"
      );
    },
  },
  correct_answer: {
    type: mongoose.Schema.Types.Mixed,
    required: function () {
      return (
        this.question_type === "text_answer" ||
        this.question_type === "numeric_answer"
      );
    },
  },
  points: { type: Number, required: true },
});

const FeedbackSchema = new mongoose.Schema({
  excellent: { type: String, required: true },
  good: { type: String, required: true },
  satisfactory: { type: String, required: true },
  fail: { type: String, required: true },
});

const QuizSchema = new mongoose.Schema({
  test_title: { type: String, required: true },
  description: { type: String, required: true },
  time_limit_minutes: { type: Number, required: true },
  questions: { type: [QuestionSchema], required: true },
  passing_score: { type: Number, required: true },
  feedback: { type: FeedbackSchema, required: true },
});

module.exports = mongoose.model("Quiz", QuizSchema);
