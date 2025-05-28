import { useState } from "react";
import { Link } from "react-router-dom";
import "./edittestpage.scss";

const TestEditor = () => {
  // Состояние для хранения вопросов и ответов
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Вопрос №1",
      answers: [
        {
          id: 1,
          text: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
        },
        {
          id: 2,
          text: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
        },
        {
          id: 3,
          text: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
        },
      ],
    },
    {
      id: 2,
      text: "Вопрос №2",
      answers: [],
    },
    {
      id: 3,
      text: "Вопрос №3",
      answers: [],
    },
  ]);

  // Состояние для отслеживания свернутых вопросов
  const [collapsedQuestions, setCollapsedQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({}); // { questionId: answerId }

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
  };

  // Удаление ответа
  const deleteAnswer = (questionId, answerId) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.filter(a => a.id !== answerId),
          };
        }
        return q;
      })
    );

    // Если удаляемый ответ был правильным, сбрасываем выбор
    if (correctAnswers[questionId] === answerId) {
      setCorrectAnswers(prev => ({
        ...prev,
        [questionId]: null,
      }));
    }
  };

  // Обработчики изменений
  const handleQuestionChange = (id, newText) => {
    setQuestions(
      questions.map(q => (q.id === id ? { ...q, text: newText } : q))
    );
  };

  const handleAnswerChange = (questionId, answerId, newText) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map(a =>
              a.id === answerId ? { ...a, text: newText } : a
            ),
          };
        }
        return q;
      })
    );
  };

  const addAnswer = questionId => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          const newId =
            q.answers.length > 0
              ? Math.max(...q.answers.map(a => a.id)) + 1
              : 1;
          return {
            ...q,
            answers: [...q.answers, { id: newId, text: "" }],
          };
        }
        return q;
      })
    );
  };

  const saveTest = () => {
    // Здесь будет логика сохранения теста
    console.log("Тест сохранен:", questions);
    alert("Тест успешно сохранен!");
  };

  return (
    <div className="test-editor">
      <h1 className="test-editor__title">Редактирование теста</h1>

      {questions.map(question => {
        const isCollapsed = collapsedQuestions.includes(question.id);

        return (
          <div key={question.id} className="question-block">
            <div className="question-header">
              <h3 className="question-block__title">Вопрос №{question.id}</h3>
              <button
                onClick={() => toggleQuestionCollapse(question.id)}
                className={`question-block__open-btn ${
                  isCollapsed ? "question-block__open-btn--collapsed" : ""
                }`}
              >
                <img
                  src="../../../public/down-arrow.svg"
                  width={25}
                  height={25}
                  style={{
                    transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </button>
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
                          correctAnswers[question.id] === answer.id
                            ? "active"
                            : ""
                        }`}
                      >
                        <img
                          src="../../../public/checkmark.svg"
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
                          src="../../../public/trash.svg"
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

      <div className="actions">
        <Link to="/">
          <button className="back-btn">Назад</button>
        </Link>
        <button onClick={saveTest} className="save-btn">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default TestEditor;
