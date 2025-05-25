import { useState, useEffect } from "react";
import { questions } from "./questions";
import "./testpage.scss";
import { fetchTestById, submitTestResults } from "../../api/api.js";

const TestPage = () => {
  // В компоненте:
  useEffect(() => {
    const loadTest = async () => {
      try {
        const testId = "6832151e7182100f171107bc"; // или получайте из URL/параметров
        const testData = await fetchTestById(testId);
        setTest(testData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadTest();
  }, []);
  
  // состояния вопросов, ответов и результатов теста
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
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
        // Завершение теста
        setShowResult(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  // Рестарт теста
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResult(false);
  };

  // Получение результата после завершения теста
  const getCorrectAnswersCount = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (
        selectedAnswers[index] !== undefined &&
        selectedAnswers[index] === question.correctAnswer
      ) {
        correctCount++;
      }
    });
    return correctCount;
  };

  return (
    <div className="test-page">
      {!showResult ? (
        // Интерфейс прохождения теста
        <div>
          <h2 className="test-page__title">{`${
            currentQuestionIndex + 1
          }/${totalQuestions}`}</h2>
          <p className="test-page__current">{currentQuestion.question}</p>

          {/* Варианты ответов */}
          <div className="test-page__options">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="test-page__label">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={selectedAnswers[currentQuestionIndex] === index}
                  onChange={() => handleOptionSelect(index)}
                />
                {option}
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
            <button disabled={!isAnswerSelected} onClick={handleNextQuestion}>
              {isLastQuestion ? "Завершить" : "Следующий вопрос"}
            </button>
          </div>
        </div>
      ) : (
        // Результат после завершения теста
        <div className="test-page__result">
          <h2>Результат прохождения теста</h2>
          <p className="test-page__result-corrent">
            Верных ответов: {getCorrectAnswersCount()} из {totalQuestions}
          </p>
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
