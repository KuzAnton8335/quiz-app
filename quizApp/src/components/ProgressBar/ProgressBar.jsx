import "./progressBar.scss";

const ProgressBar = ({ correct, total }) => {
  const progressWidth = `${(correct / total) * 100}%`;
  return (
    <div className="progress-bar">
      <div className="correct" style={{ width: progressWidth }}></div>
      <div
        className="incorrect"
        style={{ width: `calc(100% - ${progressWidth})` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
