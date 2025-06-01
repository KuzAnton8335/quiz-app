import { useEffect, useState } from "react";
import HeaderButtons from "../../components/HeaderButtons";
import HistoryItem from "../../components/HistoryItem";
import "./index.scss";

const IndexPage = () => {
  // История прохождений
  const [historyData, setHistoryData] = useState([]);

  // Загрузка истории из localStorage при монтировании компонента
  useEffect(() => {
    const savedHistory = localStorage.getItem("quizHistory");
    if (savedHistory) {
      setHistoryData(JSON.parse(savedHistory));
    }
  }, []);

  // Функция для добавления новой записи в историю
  const addHistoryItem = (correct, total) => {
    const now = new Date();
    const date = now.toLocaleDateString("ru-RU");
    const time = now.toLocaleTimeString("ru-RU");

    const newItem = {
      date,
      time,
      correct,
      total,
    };

    const updatedHistory = [newItem, ...historyData];
    setHistoryData(updatedHistory);
    localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));
  };

  // разметка
  return (
    <div className="indexPage">
      <div className="indexPage__wrapper">
        <HeaderButtons />
        <div className="indexPage__title">
          <h2>История прохождений</h2>
        </div>

        {/* Список историй */}
        <div className="history-list">
          {historyData.length > 0 ? (
            historyData.map((item, index) => (
              <HistoryItem key={index} {...item} />
            ))
          ) : (
            <p>Нет данных о прохождениях</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
