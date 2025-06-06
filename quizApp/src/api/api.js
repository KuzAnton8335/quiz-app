import axios from "axios";
const API_URL = "http://localhost:3001/user/quizdb";

// Получить все квизы
export const getQuizzes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Получить конкретный квиз
export const getQuiz = async id => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

// Проверить ответы и сохранить в историю
export const checkAnswers = async (quizId, answers) => {
  try {
    const response = await axios.post(`${API_URL}/${quizId}/check-answers`, {
      answers,
    });
    console.log(response.answers);

    // Сохраняем результат в историю
    const now = new Date();
    const date = now.toLocaleDateString("ru-RU");
    const time = now.toLocaleTimeString("ru-RU");

    const historyItem = {
      date,
      time,
      correct: response.data.correctCount,
      total: response.data.totalQuestions,
    };

    const savedHistory = JSON.parse(
      localStorage.getItem("quizHistory") || "[]"
    );
    const updatedHistory = [historyItem, ...savedHistory];
    localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));
    return response.data;
  } catch (error) {
    console.error("Error checking answers:", error);
    throw error;
  }
};

// Обновить квиз (админ)
export const updateQuiz = async (id, quizData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, quizData);
    return response.data;
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw error;
  }
};
