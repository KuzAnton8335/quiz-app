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

// Проверить ответы
export const checkAnswers = async (quizId, answers) => {
  try {
    const response = await axios.post(`${API_URL}/${quizId}/check-answers`, {
      answers,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking answers:", error);
    throw error;
  }
};

// Создать новый квиз (админ)
export const createQuiz = async quizData => {
  try {
    const response = await axios.post(API_URL, quizData);
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};
