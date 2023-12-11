import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import AddTasksSlice from "../features/AddTasks/AddTasksSlice";
import ShowTasksSlice from "../features/ShowTasks/ShowTasksSlice";
import RunningTasksSlice from "../features/RunningTasks/RunningTasksSlice";
import { apiSlice } from "../features/api/apiSlice";

export default configureStore({
  reducer: {
    addTasks: AddTasksSlice,
    showTasks: ShowTasksSlice,
    runningTasks: RunningTasksSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
