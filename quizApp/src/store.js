import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./actions/quizSlice";

export default configureStore({
  reducer: {
    quiz: quizReducer,
  },
});
