import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

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

export const addTasksQuerySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addAll: builder.mutation({
      queryFn: async (_, { getState }, options, baseQuery) => {
        const heads = getHeadsEntities(getState());
        const subs = getSubsEntities(getState());
        const tasks = getTasksEntities(getState());

        delete heads["readOnly"];
        delete subs["readOnly"];

        const res = await baseQuery({
          url: "/all",
          data: { heads, tasks, subs },
          method: "POST",
        });

        return res;
      },
      invalidatesTags: [{ type: "Data", id: "LIST" }],
    }),

    getSub: builder.mutation({
      query: (subId) => `/subs/${subId}`,
    }),
    getHead: builder.mutation({
      query: (headId) => `/heads/${headId}`,
    }),
  }),
});

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
    clear(state, action) {
      headsAdapter.removeAll(state.heads);
      subsAdapter.removeAll(state.subs);
      tasksAdapter.removeAll(state.tasks);
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
  },
});

const { addHeads, addSubs, deleteHeads, deleteSubs } = addTasksSlice.actions;

export const changeNumberOfHeads = (headNum) => (dispatch) => {
  const lastIndex = Date.now();
  const heads = [...Array(headNum)].map((_, index) => {
    const id = (index + lastIndex).toString(36);
    dispatch(changeNumberOfSubs({ num: 1, headId: id }));
    return {
      id,
      name: "",
      readOnly: false,
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
        readOnly: false,
      };
    });

    dispatch(addSubs(subs));
  };

export const addSubToHead = createAsyncThunk(
  "addTasks/addSubToHead",
  async (headId, { dispatch, rejectWithValue, getState }) => {
    const subs = getSubsEntities(getState());

    if (!subs.length)
      try {
        // get head by id
        const head = await dispatch(
          addTasksQuerySlice.endpoints.getHead.initiate(headId, {
            track: false,
          })
        ).unwrap();

        // add the data of head
        dispatch(addHeads([{ id: head.id, name: head.name, readOnly: true }]));

        const subs = getSubsOfHead(getState());
        if (!subs.length) dispatch(changeNumberOfSubs({ num: 1, headId }));
      } catch (err) {
        throw rejectWithValue(err);
      }
  }
);

export const addTaskToSub = createAsyncThunk(
  "addTasks/addTasToSub",
  async ({ headId, subId }, { dispatch, rejectWithValue, getState }) => {
    try {
      // get head by id
      const head = await dispatch(
        addTasksQuerySlice.endpoints.getHead.initiate(headId, {
          track: false,
        })
      ).unwrap();

      // get sub by id
      const sub = await dispatch(
        addTasksQuerySlice.endpoints.getSub.initiate(subId, {
          track: false,
        })
      ).unwrap();

      // add the data of head
      dispatch(addHeads([{ id: head.id, name: head.name, readOnly: true }]));

      // add the data of sub
      dispatch(
        addSubs([
          {
            id: sub.id,
            name: sub.name,
            readOnly: true,
            headId,
          },
        ])
      );

      const tasks = getTasksOfSub(getState());

      if (!tasks.length) dispatch(changeNumberOfTasks({ num: 1, subId }));
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

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
  clear,
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
  (subs, headId) => {
    return subs.filter((sub) => sub.slice(0, sub.indexOf(":")) === headId);
  }
);
export const getTasksOfSub = createSelector(
  [getTasks, (state, subId) => subId],
  (tasks, subId) => {
    return tasks.filter((task) => {
      return task.slice(0, task.lastIndexOf(":")) === subId;
    });
  }
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
export const { useAddAllMutation, useAddSubToHeadMutation } =
  addTasksQuerySlice;
