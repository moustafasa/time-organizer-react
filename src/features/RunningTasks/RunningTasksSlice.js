import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const runningTasksAdapter = createEntityAdapter();

const initialState = runningTasksAdapter.getInitialState({ currentDay: "" });

export const runTasksQuerySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addRunTasks: builder.mutation({
      query: (data) => ({
        url: "/runningTasks",
        method: "post",
        data: data,
      }),
      invalidatesTags: ["RunTasks"],
    }),
    getRunningTasks: builder.query({
      query: (day) => `/runningTasks/${day || "all"}`,
      transformResponse: (resData) =>
        runningTasksAdapter.setAll(initialState, resData),
      providesTags: ["RunTasks"],
    }),
    deleteFromRunTasks: builder.mutation({
      query: (id) => ({ url: `/runningTasks/${id}`, method: "DELETE" }),
      invalidatesTags: ["RunTasks"],
    }),
  }),
});

const RunningTasksSlice = createSlice({
  name: "runningTasks",
  initialState: initialState,
  reducers: {
    changeCurrentDay(state, action) {
      state.currentDay = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { selectIds: getRunTasksIds, selectById: getRunTaskById } =
  runningTasksAdapter.getSelectors((state) => state ?? initialState);

export const {
  useAddRunTasksMutation,
  useGetRunningTasksQuery,
  useDeleteFromRunTasksMutation,
} = runTasksQuerySlice;

export const getCurrentDay = (state) => state.runningTasks.currentDay;

export const { changeCurrentDay } = RunningTasksSlice.actions;
export default RunningTasksSlice.reducer;
