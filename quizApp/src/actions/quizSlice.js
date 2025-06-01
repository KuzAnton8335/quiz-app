import { createSlice } from "@reduxjs/toolkit";
import { fetchQuiz, saveQuiz } from "./quizActions";

const initialState = {
  quiz: null,
  loading: false,
  error: null,
  success: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    resetQuizState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    updateQuizLocal: (state, action) => {
      state.quiz = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchQuiz.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveQuiz.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quiz = action.payload;
        state.success = true;
      })
      .addCase(saveQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetQuizState, updateQuizLocal } = quizSlice.actions;
export default quizSlice.reducer;
