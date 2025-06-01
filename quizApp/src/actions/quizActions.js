import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/api";

// Асинхронные действия
export const fetchQuiz = createAsyncThunk(
  "quiz/fetchQuiz",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getQuiz(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const saveQuiz = createAsyncThunk(
  "quiz/saveQuiz",
  async ({ id, quizData }, { rejectWithValue }) => {
    try {
      const response = id
        ? await api.updateQuiz(id, quizData)
        : await api.createQuiz(quizData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
