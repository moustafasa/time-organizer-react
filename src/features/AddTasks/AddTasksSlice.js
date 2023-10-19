import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const headsAdapter = createEntityAdapter();
const headsState = headsAdapter.getInitialState({ currentHead: 0 });

const subsAdapter = createEntityAdapter();
const subsState = subsAdapter.getInitialState({ currentSub: 0 });

const tasksAdapter = createEntityAdapter();
const tasksState = tasksAdapter.getInitialState({ currentTask: 0 });

const initialState = {
  numberOfTasks: 0,
  heads: headsState,
  subs: subsAdapter,
  tasks: tasksAdapter,
};
const addTasksSlice = createSlice({
  initialState: initialState,
  name: "addTasks",
  reducers: {
    changeNumberOfTasks(state, action) {
      state.numberOfTasks = action.payload;
    },
    addTask: tasksAdapter.addOne,
    addHead: headsAdapter.addOne,
    addSub: subsAdapter.addOne,
  },
});

export default addTasksSlice.reducer;
export const { changeNumberOfTasks } = addTasksSlice.actions;
export const { selectById: getHeadById, selectIds: getHeads } =
  headsAdapter.getSelectors();
export const { selectById: getSubById, selectIds: getSubs } =
  subsAdapter.getSelectors();
export const { selectById: getTaskById, selectIds: getTasks } =
  tasksAdapter.getSelectors();
export const getNumberOfTasks = (state) => state.addTasks.numberOfTasks;
