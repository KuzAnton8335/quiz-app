import HeaderButtons from "../../components/HeaderButtons";
import HistoryItem from "../../components/HistoryItem";
import "./index.scss";

const IndexPage = () => {
  // Данные истории прохождений
  const historyData = [
    { date: "01.01.2023", time: "16:46:37", correct: 5, total: 10 },
    { date: "01.01.2023", time: "16:46:37", correct: 4, total: 10 },
    { date: "01.01.2023", time: "16:46:37", correct: 5, total: 10 },
  ];
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
          {historyData.map((item, index) => (
            <HistoryItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
