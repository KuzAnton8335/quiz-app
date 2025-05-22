import { useState } from "react";
import "./edittestpage.scss";
import { initialQuestions } from "./initialQuestions";

const EditTestPage = () => {
  // useState для хранения вопросов теста
  const [questions, setQuestions] = useState(initialQuestions);

  // добавление нового вопроса
  const addQuestion = () => {
    const newQuestionId = questions.length + 1;
    setQuestions([
      ...questions,
      {
        id: newQuestionId,
        text: `Вопрос №${newQuestionId}`,
        options: [],
      },
    ]);
  };

  // удаление вопроca
  const deleteQuestion = questionId => {
    setQuestions(questions.filter(question => question.id !== questionId));
  };

  // Обнавление текста вопроca
  const updateQuestionText = (questionId, newText) => {
    setQuestions(
      questions.map(q => (q.id === questionId ? { ...q, text: newText } : q))
    );
  };

  // добавление нового варианта ответа
  const addOption = questionId => {
    const question = questions.find(q => q.id === questionId);
    const newOptionId = question.options.length + 1;
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                { id: newOptionId, text: "", isCorrect: false },
              ],
            }
          : q
      )
    );
  };

  // удаление варианта ответа
  const deleteOption = (questionId, optionId) => {
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter(o => o.id !== optionId),
            }
          : q
      )
    );
  };

  // обновление текста варианта ответа
  const updateOptionText = (questionId, optionId, newText) => {
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(o =>
                o.id === optionId ? { ...o, text: newText } : o
              ),
            }
          : q
      )
    );
  };

  // Изменение статуса правильного ответа
  const toggleCorrectOption = (questionId, optionId) => {
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(o =>
                o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o
              ),
            }
          : q
      )
    );
  };

  // Сохранение теста
  const saveTest = () => {
    console.log("Тест сохранен:", questions);
    // Здесь можно отправить данные на сервер или выполнить другие действия
  };

  return (
    <div className="edit-testpage">
      <h1>Редактирование теста</h1>

      {/* Список вопросов */}
      <div className="questions-list">
        {questions.map(question => (
          <div key={question.id} className="questions-list__card">
            <div className="questions-list__header">
              <input
                type="text"
                value={question.text}
                onChange={e => updateQuestionText(question.id, e.target.value)}
                placeholder="Введите текст вопроса"
              />
              <button onClick={() => deleteQuestion(question.id)}>
                Удалить вопрос
              </button>
            </div>

            {/* Варианты ответов */}
            <div className="options-list">
              {question.options.map(option => (
                <div key={option.id} className="options-list__card">
                  <input
                    type="text"
                    value={option.text}
                    onChange={e =>
                      updateOptionText(question.id, option.id, e.target.value)
                    }
                    placeholder="Введите текст варианта ответа"
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() =>
                        toggleCorrectOption(question.id, option.id)
                      }
                    />
                    Правильный
                  </label>
                  <button onClick={() => deleteOption(question.id, option.id)}>
                    Удалить
                  </button>
                </div>
              ))}
            </div>

            {/* Кнопка добавления варианта ответа */}
            <button onClick={() => addOption(question.id)}>
              Добавить вариант ответа
            </button>
          </div>
        ))}
      </div>

      {/* Кнопки управления */}
      <div className="controls">
        <button onClick={addQuestion}>Добавить вопрос</button>
        <button onClick={saveTest} className="controls__save-button">
          Сохранить
        </button>
        <button onClick={() => (window.location.href = "/")}>Назад</button>
      </div>
    </div>
  );
};

export default EditTestPage;
