import { useEffect, useState } from "react";
import { checkAnswers, getQuiz } from "../../api/api.js";
import { convertOptionToString } from "./convertOptionToString.js";
import "./testpage.scss";

const TestPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({});

  // Загрузка теста при монтировании
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizId = "683756df0417873adec97fac"; // или получайте из URL/параметров
        const quizData = await getQuiz(quizId);
        console.log("Загруженный тест:", quizData);
        setQuiz(quizData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadQuiz();
  }, []);

  // Эффект для загрузки результатов при изменении selectedAnswers
  useEffect(() => {
    if (showResult && selectedAnswers.length > 0 && quiz) {
      const fetchResults = async () => {
        try {
          setLoading(true);
          const results = await checkAnswers(quiz._id, selectedAnswers);
          console.log("API Response:", results);
          setResult(results);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [showResult, selectedAnswers, quiz]);

  if (loading) return <div>Загрузка теста...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!quiz) return <div>Тест не найден</div>;

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // обработчик выбора ответа на вопрос
  const handleOptionSelect = answerIndex => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  // Проверка, выбран ли ответ для текущего вопроса
  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== undefined;

  // Переключение на предыдущий вопрос
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Переключение на следующий вопрос
  const handleNextQuestion = () => {
    if (isAnswerSelected) {
      if (isLastQuestion) {
        handleSubmitTest();
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  // Отправка результатов теста
  const handleSubmitTest = async () => {
    try {
      setLoading(true);
      const results = await checkAnswers(quiz._id, selectedAnswers);
      console.log("API Response:", results);
      setResult(results);
      setShowResult(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Рестарт теста
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setResult(null);
  };

  // Убедитеся, что текст вопроса правильно отображен
  const renderQuestionText = () => {
    if (typeof currentQuestion.question === "string") {
      return currentQuestion.question;
    }
    // If question is an object, handle it appropriately
    if (
      currentQuestion.question &&
      typeof currentQuestion.question === "object"
    ) {
      return JSON.stringify(currentQuestion.question); // or extract the specific property you need
    }
    return "Question not available";
  };

  return (
    <div className="test-page">
      {!showResult ? (
        // Интерфейс прохождения теста
        <div>
          <h2 className="test-page__title">{`${
            currentQuestionIndex + 1
          }/${totalQuestions}`}</h2>
          <p className="test-page__current">{renderQuestionText()}</p>

          {/* Варианты ответов */}
          <div className="test-page__options">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="test-page__label">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={selectedAnswers[currentQuestionIndex] === index}
                  onChange={() => handleOptionSelect(index)}
                />
                {convertOptionToString(option)}
              </label>
            ))}
          </div>

          {/* Кнопки навигации */}
          <div className="test-page__buttons">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevQuestion}
              className="test-page__button"
            >
              Предыдущий вопрос
            </button>
            <button
              disabled={!isAnswerSelected}
              onClick={handleNextQuestion}
              className="test-page__button"
            >
              {isLastQuestion ? "Завершить" : "Следующий вопрос"}
            </button>
          </div>
        </div>
      ) : (
        // Результат после завершения теста
        <div className="test-page__result">
          <h2>Результат прохождения теста</h2>
          {loading ? (
            <div>Загрузка результатов...</div>
          ) : (
            <>
              <p className="test-page__result-corrent">
                Верных ответов: {result?.correctAnswers} из{" "}
                {quiz.questions.length}
              </p>
              <p>Процент правильных ответов: {result?.percentage}%</p>

              <div className="detailed-results">
                <h3>Детализация ответов:</h3>
                <ul>
                  {result.results?.map((item, index) => (
                    <li
                      key={index}
                      className={item.isCorrect ? "correct" : "incorrect"}
                    >
                      Вопрос {index + 1}: Ваш ответ - {item.userAnswer + 1}(
                      {item.isCorrect ? "✓ Верно" : "✗ Неверно"})
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <button onClick={handleRestart} className="test-page__result-btn">
            Пройти еще раз
          </button>
          <button onClick={() => (window.location.href = "/")}>
            На главную
          </button>
        </div>
      )}
    </div>
  );
};
export default TestPage;
