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
  console.log(selectedAnswers);

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
      // Отправляем только ID теста и выбранные ответы
      const response = await checkAnswers(quiz._id, selectedAnswers);
      console.log("API Response:", response);
      setResult(response); // Сохраняем ответ сервера (если нужен для чего-то еще)
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

  console.log("Quiz structure:", quiz);
  console.log("Current question:", currentQuestion);

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
                Верных ответов: {result?.correctAnswers ?? 0} из{" "}
                {quiz.questions.length}
              </p>
              <p>Процент правильных ответов: {result?.percentage ?? 0}%</p>

              <div className="detailed-results">
                <h3>Детализация ответов:</h3>
                {quiz.questions.map((question, index) => {
                  const userAnswerIndex = selectedAnswers[index]; // Индекс выбранного ответа (например, 1)
                  const userAnswerText = question.options[userAnswerIndex]; // Текст выбранного ответа (например, "JavaScript")
                  const correctAnswerText = question.correctAnswer; // Текст правильного ответа (например, "JavaScript")

                  // Сравниваем текст выбранного ответа с текстом правильного ответа
                  const isCorrect = userAnswerText === correctAnswerText;

                  return (
                    <li
                      key={index}
                      className={`detailed-results__item ${
                        isCorrect
                          ? "detailed-results__item--correct"
                          : "detailed-results__item--incorrect"
                      }`}
                    >
                      <div className="detailed-results__question">
                        <strong>Вопрос {index + 1}:</strong> {question.question}
                      </div>

                      <div className="detailed-results__user-answer">
                        <span className="detailed-results__label">
                          Ваш ответ:
                        </span>
                        <span>{convertOptionToString(userAnswerText)}</span>
                      </div>

                      {!isCorrect && (
                        <div className="detailed-results__correct-answer">
                          <span className="detailed-results__label">
                            Правильный ответ:
                          </span>
                          <span>
                            {convertOptionToString(correctAnswerText)}
                          </span>
                        </div>
                      )}

                      <div className="detailed-results__status">
                        {isCorrect ? (
                          <span className="detailed-results__correct">
                            ✓ Верно
                          </span>
                        ) : (
                          <span className="detailed-results__incorrect">
                            ✗ Неверно
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
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
