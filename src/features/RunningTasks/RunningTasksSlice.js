import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const runningTasksAdapter = createEntityAdapter();

const querySliceState = runningTasksAdapter.getInitialState();

const initialState = {
  currentDay: "",
  pomodorosNum: 2,
  currentPomodoro: 1,
  pomodoroTime: 60,
  breakTime: 15,
  isBreak: false,
  animState: "idle", //idle | played | paused | done
};

const RunningTasksSlice = createSlice({
  name: "runningTasks",
  initialState,
  reducers: {
    changeCurrentDay(state, action) {
      state.currentDay = action.payload;
    },
    changePomodorosNum(state, action) {
      state.pomodorosNum = action.payload;
    },
    changeCurrentPomodoro(state, action) {
      state.currentPomodoro = action.payload;
    },
    changePomodoroTime(state, action) {
      state.pomodoroTime = action.payload;
    },
    changeBreakTime(state, action) {
      state.breakTime = action.payload;
    },
    changeIsBreak(state, action) {
      state.isBreak = action.payload;
    },
    changeAnimState(state, action) {
      state.animState = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const runTasksQuerySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addRunTasks: builder.mutation({
      query: (data) => ({
        url: "/runningTasks",
        method: "post",
        data: data,
      }),
      invalidatesTags: [{ type: "RunTasks", id: "LIST" }],
    }),
    getRunningTasks: builder.query({
      query: (day) => `/runningTasks/${day || "all"}`,
      transformResponse: (resData) =>
        runningTasksAdapter.setAll(querySliceState, resData),
      providesTags: (result, errors, args) => [
        { type: "RunTasks", id: "LIST" },
        ...result.ids.map((id) => ({ type: "RunTasks", id })),
      ],
    }),
    deleteFromRunTasks: builder.mutation({
      query: (id) => ({ url: `/runningTasks/${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [{ type: "RunTasks", id }],
    }),
    deleteMultiRunTasks: builder.mutation({
      query: (ids) => ({
        url: `/runningTasks/deleteMulti`,
        method: "POST",
        data: ids,
      }),
      invalidatesTags: (res, err, ids) =>
        ids.map((id) => ({ type: "RunTasks", id })),
    }),
  }),
});

export const {
  selectIds: getRunTasksIds,
  selectById: getRunTaskById,
  selectEntities: getRunTasksEntites,
} = runningTasksAdapter.getSelectors((state) => state ?? querySliceState);

export const {
  useAddRunTasksMutation,
  useGetRunningTasksQuery,
  useDeleteFromRunTasksMutation,
  useDeleteMultiRunTasksMutation,
} = runTasksQuerySlice;

export const getCurrentDay = (state) => state.runningTasks.currentDay;
export const getPomodorosNum = (state) => state.runningTasks.pomodorosNum;
export const getPomodoroTime = (state) => state.runningTasks.pomodoroTime;
export const getBreakTime = (state) => state.runningTasks.breakTime;
export const getIsBreak = (state) => state.runningTasks.isBreak;
export const getAnimState = (state) => state.runningTasks.animState;
export const getCurrentPomodoro = (state) => state.runningTasks.currentPomodoro;

export const {
  changeCurrentDay,
  changePomodoroTime,
  changePomodorosNum,
  changeBreakTime,
  changeAnimState,
  changeIsBreak,
  changeCurrentPomodoro,
} = RunningTasksSlice.actions;

export default RunningTasksSlice.reducer;
