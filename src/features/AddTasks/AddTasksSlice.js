import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  numberOfTasks: 0,
  currentTask: 0,
};
const addTasksSlice = createSlice({
  initialState: initialState,
  name: "addTasks",
  reducers: {
    changeNumberOfTasks(state, action) {
      state.numberOfTasks = action.payload;
    },
  },
});

export default addTasksSlice.reducer;
export const { changeNumberOfTasks } = addTasksSlice.actions;

export const getNumberOfTasks = (state) => state.addTasks.numberOfTasks;
