import { configureStore } from "@reduxjs/toolkit";
import AddTasksSlice from "../features/AddTasks/AddTasksSlice";

export default configureStore({
  reducer: {
    addTasks: AddTasksSlice,
  },
});
