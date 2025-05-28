const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const quizRoutes = require("./quizRotes/quizRotes");

//порт сервера
const PORT = process.env.PORT || 3001;
// подключение к базе данных mongo-db
const connectDb = require("./config/db");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
  })
);
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.send("Quiz API is running...");
});

// запросы для тестирования
app.use("/user/quizdb", quizRoutes);

// Error handlers (после всех роутов)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Database connection and server start
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Database connection failed", error);
    process.exit(1);
  });
