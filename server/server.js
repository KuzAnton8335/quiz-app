const app = require("./app");
const quizRoutes = require("./quizRotes/quizRotes");

app.use("/quiz", quizRoutes);

// Запуск сервера на порту 3000
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
