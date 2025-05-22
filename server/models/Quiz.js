const mongoose = require("mongoose");

const QuizShema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

module.exports = mongoose.model("Quiz", QuizShema);
