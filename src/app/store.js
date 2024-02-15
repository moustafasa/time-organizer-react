import { configureStore } from "@reduxjs/toolkit";
import AddTasksReducer from "../features/AddTasks/AddTasksSlice";
import ShowTasksReducer from "../features/ShowTasks/ShowTasksSlice";
import RunningTasksReducer from "../features/RunningTasks/RunningTasksSlice";
import { apiSlice } from "../features/api/apiSlice";
import authReducer from "../features/auth/authSlice";

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    addTasks: AddTasksReducer,
    showTasks: ShowTasksReducer,
    runningTasks: RunningTasksReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
