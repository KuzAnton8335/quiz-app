import { Link } from "react-router-dom";
import "./headersButtons.scss";

const HeaderButtons = () => {
  return (
    <div className="header-buttons">
      <Link to="/test">
        <button className="header-buttons__btn">Запустить тест</button>
      </Link>
      <Link to="/edit">
        <button className="header-buttons__btn">Редактировать тест</button>
      </Link>
    </div>
  );
};

export default HeaderButtons;
