import { configureStore } from "@reduxjs/toolkit";
import AddTasksSlice from "../features/AddTasks/AddTasksSlice";
import ShowTasksSlice from "../features/ShowTasks/ShowTasksSlice";

export default configureStore({
  reducer: {
    addTasks: AddTasksSlice,
    showTasks: ShowTasksSlice,
  },
});
