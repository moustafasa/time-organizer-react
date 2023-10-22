import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

const headsAdapter = createEntityAdapter();
const headsState = headsAdapter.getInitialState({
  currentHead: 0,
});

const subsAdapter = createEntityAdapter();
const subsState = subsAdapter.getInitialState({
  currentSub: 0,
});

const tasksAdapter = createEntityAdapter();
const tasksState = tasksAdapter.getInitialState({
  currentTask: 0,
});

const initialState = {
  heads: headsState,
  subs: subsState,
  tasks: tasksState,
};
const addTasksSlice = createSlice({
  initialState: initialState,
  name: "addTasks",
  reducers: {
    addHeads(state, action) {
      headsAdapter.addMany(state.heads, action.payload);
    },
    addSubs(state, action) {
      subsAdapter.addMany(state.subs, action.payload);
    },
    deleteSubs(state, action) {
      subsAdapter.removeOne(state.subs, action.payload);
    },
    deleteTasks(state, action) {
      tasksAdapter.removeMany(state.tasks, action.payload);
    },
    deleteHeads(state, action) {
      headsAdapter.removeOne(state.heads, action.payload);
    },
    updateHead(state, action) {
      headsAdapter.updateOne(state.heads, action.payload);
    },
    updateSub(state, action) {
      headsAdapter.updateOne(state.subs, action.payload);
    },
    updateTask(state, action) {
      headsAdapter.updateOne(state.tasks, action.payload);
    },
    changeNumberOfTasks(state, action) {
      const lastIndex = Date.now();
      const tasks = [...Array(action.payload.num)].map((_, index) => {
        return {
          id: `${action.payload.subId}:${(index + lastIndex).toString(36)}`,
          name: "",
          subTasksNum: 0,
          subTasksDone: 0,
        };
      });
      tasksAdapter.addMany(state.tasks, tasks);
    },
  },
});

const { addHeads, addSubs } = addTasksSlice.actions;
export const changeNumberOfHeads = (headNum) => (dispatch) => {
  const lastIndex = Date.now();
  const heads = [...Array(headNum)].map((_, index) => {
    const id = (index + lastIndex).toString(36);
    dispatch(changeNumberOfSubs({ num: 1, headId: id }));
    return { id, name: "" };
  });
  dispatch(addHeads(heads));
};
export const changeNumberOfSubs =
  ({ num, headId }) =>
  (dispatch) => {
    const lastIndex = Date.now();
    const subs = [...Array(num)].map((_, index) => {
      const id = `${headId}:${(index + lastIndex).toString(36)}`;
      dispatch(changeNumberOfTasks({ num: 1, subId: id }));
      return {
        id,
        name: "",
      };
    });
    dispatch(addSubs(subs));
  };

export default addTasksSlice.reducer;
export const {
  changeNumberOfTasks,
  updateHead,
  updateSub,
  updateTask,
  deleteTasks,
} = addTasksSlice.actions;
export const { selectById: getHeadById, selectIds: getHeads } =
  headsAdapter.getSelectors((state) => state.addTasks.heads);
export const { selectById: getSubById, selectIds: getSubs } =
  subsAdapter.getSelectors((state) => state.addTasks.subs);
export const { selectById: getTaskById, selectIds: getTasks } =
  tasksAdapter.getSelectors((state) => state.addTasks.tasks);

export const getSubsOfHead = createSelector(
  [getSubs, (state, headId) => headId],
  (subs, headId) => subs.filter((sub) => sub.split(":")[0] === headId)
);
export const getTasksOfSub = createSelector(
  [getTasks, (state, subId) => subId],
  (tasks, subId) =>
    tasks.filter(
      (task) => task.split(":")[0] + ":" + task.split(":")[1] === subId
    )
);
