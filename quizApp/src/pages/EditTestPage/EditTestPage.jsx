import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchQuiz, saveQuiz } from "../../actions/quizActions";
import { resetQuizState, updateQuizLocal } from "../../actions/quizSlice";
import "./edittestpage.scss";

const TestEditor = () => {
  const { id } = useParams(); // для редактирования существующего теста
  const dispatch = useDispatch();
  const { quiz, loading, error, success } = useSelector(state => state.quiz);

  // Локальные состояния
  const [collapsedQuestions, setCollapsedQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});

  // Загружаем тест при монтировании (если есть id)
  useEffect(() => {
    if (id) {
      dispatch(fetchQuiz(id));
    } else {
      // Инициализируем новый тест
      dispatch(
        updateQuizLocal({
          title: "Новый тест",
          questions: [
            {
              id: 1,
              text: "Вопрос №1",
              answers: [],
            },
          ],
        })
      );
    }

    return () => {
      dispatch(resetQuizState());
    };
  }, [id, dispatch]);

  // Переключение состояния свернутости вопроса
  const toggleQuestionCollapse = questionId => {
    setCollapsedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Переключение правильного ответа
  const toggleCorrectAnswer = (questionId, answerId) => {
    setCorrectAnswers(prev => ({
      ...prev,
      [questionId]: prev[questionId] === answerId ? null : answerId,
    }));

    // Обновляем в Redux store
    const updatedQuestions = quiz.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.map(a => ({
            ...a,
            isCorrect: a.id === answerId,
          })),
        };
      }
      return q;
    });

    dispatch(
      updateQuizLocal({
        ...quiz,
        questions: updatedQuestions,
      })
    );
  };

  // Удаление ответа
  const deleteAnswer = (questionId, answerId) => {
    const updatedQuestions = quiz.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.filter(a => a.id !== answerId),
        };
      }
      return q;
    });

    dispatch(
      updateQuizLocal({
        ...quiz,
        questions: updatedQuestions,
      })
    );
  };

  // Обработчики изменений
  const handleQuestionChange = (id, newText) => {
    const updatedQuestions = quiz.questions.map(q =>
      q.id === id ? { ...q, text: newText } : q
    );

    dispatch(
      updateQuizLocal({
        ...quiz,
        questions: updatedQuestions,
      })
    );
  };

  const handleAnswerChange = (questionId, answerId, newText) => {
    const updatedQuestions = quiz.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.map(a =>
            a.id === answerId ? { ...a, text: newText } : a
          ),
        };
      }
      return q;
    });

    dispatch(
      updateQuizLocal({
        ...quiz,
        questions: updatedQuestions,
      })
    );
  };

  const addAnswer = questionId => {
    const updatedQuestions = quiz.questions.map(q => {
      if (q.id === questionId) {
        const newId =
          q.answers.length > 0 ? Math.max(...q.answers.map(a => a.id)) + 1 : 1;
        return {
          ...q,
          answers: [...q.answers, { id: newId, text: "", isCorrect: false }],
        };
      }
      return q;
    });

    dispatch(
      updateQuizLocal({
        ...quiz,
        questions: updatedQuestions,
      })
    );
  };

  const addQuestion = () => {
    const newId =
      quiz.questions.length > 0
        ? Math.max(...quiz.questions.map(q => q.id)) + 1
        : 1;

    dispatch(
      updateQuizLocal({
        ...quiz,
        questions: [
          ...quiz.questions,
          {
            id: newId,
            text: `Вопрос №${newId}`,
            answers: [],
          },
        ],
      })
    );
  };

  const deleteQuestion = questionId => {
    dispatch(
      updateQuizLocal({
        ...quiz,
        questions: quiz.questions.filter(q => q.id !== questionId),
      })
    );
  };

  const saveTest = () => {
    if (!quiz.title || !quiz.questions.length) {
      alert(
        "Пожалуйста, добавьте хотя бы один вопрос и укажите название теста"
      );
      return;
    }

    // Проверяем, что у каждого вопроса есть хотя бы один ответ и один правильный ответ
    for (const question of quiz.questions) {
      if (!question.answers.length) {
        alert(`Вопрос "${question.text}" не имеет ответов!`);
        return;
      }

      if (!question.answers.some(a => a.isCorrect)) {
        alert(`Вопрос "${question.text}" не имеет правильного ответа!`);
        return;
      }
    }

    dispatch(saveQuiz({ id, quizData: quiz }));
  };

  if (loading && !quiz) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!quiz) return <div>Тест не найден</div>;

  return (
    <div className="test-editor">
      <h1 className="test-editor__title">
        {id ? "Редактирование теста" : "Создание нового теста"}
      </h1>

      <div className="test-title-input">
        <label>Название теста:</label>
        <input
          type="text"
          value={quiz.title}
          onChange={e =>
            dispatch(
              updateQuizLocal({
                ...quiz,
                title: e.target.value,
              })
            )
          }
        />
      </div>

      {quiz.questions.map(question => {
        const isCollapsed = collapsedQuestions.includes(question.id);

        return (
          <div key={question.id} className="question-block">
            <div className="question-header">
              <h3 className="question-block__title">Вопрос №{question.id}</h3>
              <div className="question-actions">
                <button
                  onClick={() => deleteQuestion(question.id)}
                  className="delete-question-btn"
                >
                  Удалить вопрос
                </button>
                <button
                  onClick={() => toggleQuestionCollapse(question.id)}
                  className={`question-block__open-btn ${
                    isCollapsed ? "question-block__open-btn--collapsed" : ""
                  }`}
                >
                  <img
                    src="/down-arrow.svg"
                    width={25}
                    height={25}
                    style={{
                      transform: isCollapsed
                        ? "rotate(-90deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    alt={isCollapsed ? "Развернуть" : "Свернуть"}
                  />
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <>
                <input
                  type="text"
                  value={question.text}
                  onChange={e =>
                    handleQuestionChange(question.id, e.target.value)
                  }
                  className="question-input"
                />

                <h4>Ответы:</h4>
                {question.answers.map(answer => (
                  <div key={answer.id} className="answer-block">
                    <textarea
                      value={answer.text}
                      onChange={e =>
                        handleAnswerChange(
                          question.id,
                          answer.id,
                          e.target.value
                        )
                      }
                      className="answer-input"
                    />
                    <div className="answer-actions">
                      <button
                        onClick={() =>
                          toggleCorrectAnswer(question.id, answer.id)
                        }
                        className={`correct-answer-btn ${
                          answer.isCorrect ? "active" : ""
                        }`}
                      >
                        <img
                          src="/checkmark.svg"
                          width={20}
                          height={20}
                          alt="Правильный ответ"
                        />
                      </button>
                      <button
                        onClick={() => deleteAnswer(question.id, answer.id)}
                        className="delete-answer-btn"
                      >
                        <img
                          src="/trash.svg"
                          width={20}
                          height={20}
                          alt="Удалить ответ"
                        />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addAnswer(question.id)}
                  className="add-answer-btn"
                >
                  Добавить ответ
                </button>
              </>
            )}
          </div>
        );
      })}

      <button onClick={addQuestion} className="add-question-btn">
        Добавить вопрос
      </button>

      <div className="actions">
        <Link to="/">
          <button className="back-btn">Назад</button>
        </Link>
        <button onClick={saveTest} className="save-btn" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {success && (
        <div className="success-message">
          Тест успешно сохранен!
          {id ? (
            <Link to={`/test/${id}`}>Перейти к тесту</Link>
          ) : (
            <Link to="/">Вернуться на главную</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default TestEditor;
