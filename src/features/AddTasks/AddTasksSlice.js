import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const headsAdapter = createEntityAdapter();
const headsState = headsAdapter.getInitialState({
  currentHead: "",
});

const subsAdapter = createEntityAdapter();
const subsState = subsAdapter.getInitialState({
  currentSub: "",
});

const tasksAdapter = createEntityAdapter();
const tasksState = tasksAdapter.getInitialState({
  currentTask: "",
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
    // add
    addHeads(state, action) {
      headsAdapter.addMany(state.heads, action.payload);
    },
    addSubs(state, action) {
      subsAdapter.addMany(state.subs, action.payload);
    },
    changeNumberOfTasks(state, action) {
      const lastIndex = Date.now();
      const tasks = [...Array(action.payload.num)].map((_, index) => {
        return {
          id: `${action.payload.subId}:${(index + lastIndex).toString(36)}`,
          name: "",
          subId: action.payload.subId,
          headId: action.payload.subId.split(":")[0],
          subTasksNum: 0,
          subTasksDone: 0,
          progress: 0,
        };
      });
      tasksAdapter.addMany(state.tasks, tasks);
    },

    // delete
    deleteHeads(state, action) {
      headsAdapter.removeMany(state.heads, action.payload);
    },
    deleteSubs(state, action) {
      subsAdapter.removeMany(state.subs, action.payload);
    },
    deleteTasks(state, action) {
      tasksAdapter.removeMany(state.tasks, action.payload);
    },

    // update
    updateHead(state, action) {
      headsAdapter.updateOne(state.heads, action.payload);
    },
    updateSub(state, action) {
      headsAdapter.updateOne(state.subs, action.payload);
    },
    updateTask(state, action) {
      headsAdapter.updateOne(state.tasks, action.payload);
    },

    // change currentElement
    changeCurrentHead(state, action) {
      state.heads.currentHead = action.payload;
    },
    changeCurrentSub(state, action) {
      state.subs.currentSub = action.payload;
    },
    changeCurrentTask(state, action) {
      state.tasks.currentTask = action.payload;
    },

    // calc progress
    calcAll(state, action) {
      // calc tasks
      tasksAdapter.updateMany(
        state.tasks,
        state.tasks.ids.map((id) => {
          const task = state.tasks.entities[id];
          return {
            id,
            changes: {
              progress: Math.floor(
                (+task.subTasksDone / +task.subTasksNum) * 100
              ),
            },
          };
        })
      );

      // calc subs
      subsAdapter.updateMany(
        state.subs,
        state.subs.ids.map((id) => {
          const tasks = state.tasks.ids
            .filter((tId) => tId.search(id) >= 0)
            .map((task) => state.tasks.entities[task]);

          const tasksNum = tasks.length;
          const tasksDone = tasks.filter((task) => task.progress >= 100).length;
          const taskProgSum = tasks.reduce(
            (prev, curr) => prev + curr.progress,
            0
          );

          const progress = Math.floor(taskProgSum / tasksNum);

          return {
            id,
            changes: {
              tasksNum,
              tasksDone,
              progress,
            },
          };
        })
      );

      // calc heads
      headsAdapter.updateMany(
        state.heads,
        state.heads.ids.map((id) => {
          const subs = state.subs.ids
            .filter((sId) => sId.search(id) >= 0)
            .map((sub) => state.subs.entities[sub]);
          const tasksNum = subs.reduce(
            (prev, current) => prev + current.tasksNum,
            0
          );
          const tasksDone = subs.reduce(
            (prev, current) => prev + current.tasksDone,
            0
          );

          const subNum = subs.length;
          const subDone = subs.filter((sub) => sub.progress >= 100).length;

          const subProgSum = subs.reduce(
            (prev, curr) => prev + curr.progress,
            0
          );

          return {
            id,
            changes: {
              tasksNum,
              tasksDone,
              subNum,
              subDone,
              progress: Math.floor(subProgSum / subNum),
            },
          };
        })
      );
    },
  },
});

const { addHeads, addSubs, deleteHeads, deleteSubs, calcAll } =
  addTasksSlice.actions;

// const calcAll = () => (dispatch, getState) => {
//   const tasks = getTasksEntities(getState());
//   const subs = getSubsEntities(getState());
//   const tUpdates = [];
//   const sUpdates = [];
//   const hUpdates = [];
//   tasks.forEach((task) => {
//     const progress = Math.floor((+task.subTasksDone / +task.subTasksNum) * 100);
//     tUpdates.push({ id: task.id, changes: { progress } });
//   });

//   dispatch(updateMany({ type: "tasks", changes: tUpdates }));
// };

export const changeNumberOfHeads = (headNum) => (dispatch) => {
  const lastIndex = Date.now();
  const heads = [...Array(headNum)].map((_, index) => {
    const id = (index + lastIndex).toString(36);
    dispatch(changeNumberOfSubs({ num: 1, headId: id }));
    return {
      id,
      name: "",
      subNum: 1,
      subDone: 0,
      tasksNum: 0,
      tasksDone: 0,
      progress: 0,
    };
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
        headId,
        name: "",
        tasksNum: 1,
        tasksDone: 0,
        progress: 0,
      };
    });
    dispatch(addSubs(subs));
  };

export const removeHead = (head) => (dispatch, getState) => {
  const subs = getSubsOfHead(getState(), head);
  dispatch(deleteHeads([head]));
  dispatch(deleteSubs(subs));
};
export const removeSub = (sub) => (dispatch, getState) => {
  const tasks = getTasksOfSub(getState(), sub);
  dispatch(deleteSubs([sub]));
  dispatch(deleteTasks(tasks));
};

export const addTasksToRemote = createAsyncThunk(
  "addTasks/addTasksToRemote",
  async (_, { dispatch, getState }) => {
    const heads = getHeadsEntities(getState());
    const subs = getSubsEntities(getState());
    const tasks = getTasksEntities(getState());

    dispatch(calcAll());

    const headRes = await axios.post("http://localhost:3000/heads", heads);
    // const subRes = await axios.post("http://localhost:3000/subs", subs);
    // const taskRes = await axios.post("http://localhost:3000/tasks", tasks);
  }
);

export default addTasksSlice.reducer;
export const {
  changeNumberOfTasks,
  updateHead,
  updateSub,
  updateTask,
  deleteTasks,
  changeCurrentHead,
  changeCurrentTask,
  changeCurrentSub,
} = addTasksSlice.actions;
export const {
  selectById: getHeadById,
  selectIds: getHeads,
  selectAll: getHeadsEntities,
} = headsAdapter.getSelectors((state) => state.addTasks.heads);
export const {
  selectById: getSubById,
  selectIds: getSubs,
  selectAll: getSubsEntities,
} = subsAdapter.getSelectors((state) => state.addTasks.subs);
export const {
  selectById: getTaskById,
  selectIds: getTasks,
  selectAll: getTasksEntities,
} = tasksAdapter.getSelectors((state) => state.addTasks.tasks);

export const getSubsOfHead = createSelector(
  [getSubs, (state, headId) => headId],
  (subs, headId) => subs.filter((sub) => sub.search(headId) >= 0)
);
export const getTasksOfSub = createSelector(
  [getTasks, (state, subId) => subId],
  (tasks, subId) => tasks.filter((task) => task.search(subId) >= 0)
);
export const getSubsEntitiesOfHead = createSelector(
  [getSubsEntities, (state, headId) => headId],
  (subs, headId) => subs.filter((sub) => sub.headId === headId)
);
export const getTasksEntitiesOfSub = createSelector(
  [getTasksEntities, (state, subId) => subId],
  (tasks, subId) => tasks.filter((task) => task.subId === subId)
);

export const getCurrentHead = (state) => state.addTasks.heads.currentHead;
export const getCurrentSub = (state) => state.addTasks.subs.currentSub;
export const getCurrentTask = (state) => state.addTasks.tasks.currentTask;
