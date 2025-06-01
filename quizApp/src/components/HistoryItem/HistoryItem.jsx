// HistoryItem.js
import ProgressBar from "../ProgressBar";
import "./historyItem.scss";

const HistoryItem = ({ date, time, correct, total }) => {
  return (
    <div className="history-item">
      <div className="date-time">
        <span>{date}</span>
        <span>{time}</span>
      </div>
      <ProgressBar correct={correct} total={total} />
      <div className="result">
        Верно: {correct} из {total}
      </div>
    </div>
  );
};

export default HistoryItem;
