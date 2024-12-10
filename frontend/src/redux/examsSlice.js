import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../apicalls";

export const fetchAllExams = createAsyncThunk("examsSlice/fetchAllExams", async (id) => {
  const response = await axiosInstance.get(`/api/exams/getAllExamsByUser/${id}`);
  return response.data?.data;
});

export const fetchArrivedExams = createAsyncThunk("examsSlice/fetchArrivedExams", async (id) => {
  const response = await axiosInstance.get(`/api/exams/getAllArrivedExamsByUser/${id}`);
  return response.data?.data;
});

const examsSlice = createSlice({
  name: "examsSlice",
  initialState: {
    exams: [],
    arrived_exams: [],
    loading: false,
    error: null,
  },
  reducers: {
    addArrived: (state, action) => {
      state.exams = state.exams?.filter((item) => item._id !== action.payload?._id);
      if (action.payload) state.arrived_exams?.push(action?.payload);
    },
    updateExamsArr:(state,action)=>{
        state.exams=action.payload
    },
    removeArrived: (state, action) => {
      state.arrived_exams = state.arrived_exams?.filter(
        (item) => item._id !== action.payload?._id
      );
      if (action.payload) state.exams.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchAllExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchArrivedExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArrivedExams.fulfilled, (state, action) => {
        state.loading = false;
        state.arrived_exams = action.payload;
      })
      .addCase(fetchArrivedExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addArrived, removeArrived, updateExamsArr } = examsSlice.actions;
export default examsSlice.reducer;
