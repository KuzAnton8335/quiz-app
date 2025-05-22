import { Route, Routes } from "react-router-dom";
import "./App.css";
import EditTestPage from "./pages/EdtTestPage/EditTestPage.jsx";
import IndexPage from "./pages/index/index.js";
import TestPage from "./pages/TestPage/index.js";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/edit" element={<EditTestPage />} />
      </Routes>
    </div>
  );
};

export default App;
