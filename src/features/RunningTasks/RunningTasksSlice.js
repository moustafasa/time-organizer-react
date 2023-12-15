import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const runningTasksAdapter = createEntityAdapter();

const initialState = runningTasksAdapter.getInitialState();

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
      query: (type) => `/runningTasks/${type}`,
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
  reducers: {},
  extraReducers: (builder) => {},
});

export const { selectIds: getRunTasksIds, selectById: getRunTaskById } =
  runningTasksAdapter.getSelectors((state) => state ?? initialState);

export const {
  useAddRunTasksMutation,
  useGetRunningTasksQuery,
  useDeleteFromRunTasksMutation,
} = runTasksQuerySlice;

export default RunningTasksSlice.reducer;
