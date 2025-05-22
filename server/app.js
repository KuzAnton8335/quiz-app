const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

// соединяемся с базой данных
const connectDb = require("./config/db");

//обьявляем приложение app
const app = express();

// Middleware(Промежуточный слой)
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Подключаем базу данных
connectDb();

// создаем роутер
app.get("/", (req, res) => {
  res.send("Quiz API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// экспорт модуля app
module.exports = app;
