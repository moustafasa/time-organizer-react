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
  loadingStatus: false,
});

const subsAdapter = createEntityAdapter();
const subsState = subsAdapter.getInitialState({
  currentSub: "",
  loadingStatus: false,
});

const tasksAdapter = createEntityAdapter();
const tasksState = tasksAdapter.getInitialState({
  currentTask: "",
  loadingStatus: false,
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

        const res = await baseQuery({
          url: "/all",
          data: { heads, tasks, subs },
          method: "POST",
        });

        return res;
      },
      invalidatesTags: [{ type: "Heads", id: "LIST" }],
    }),

    addHeads: builder.mutation({
      query: (heads) => ({
        url: "/heads",
        method: "POST",
        data: heads,
      }),
      invalidatesTags: [{ type: "Data", id: "LIST" }],
    }),
    addSubs: builder.mutation({
      query: (subs) => ({
        url: "/subs",
        method: "POST",
        data: subs,
      }),
      invalidatesTags: [{ type: "Data", id: "LIST" }],
    }),
    addTasks: builder.mutation({
      query: (tasks) => ({
        url: "/tasks",
        method: "POST",
        data: tasks,
      }),
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
    addTasks(state, action) {
      tasksAdapter.addMany(state.tasks, action.payload);
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
  extraReducers: (builder) => {
    builder.addCase(changeNumberOfHeads.pending, (state, action) => {
      state.heads.loadingStatus = true;
    });
    builder.addCase(changeNumberOfSubs.pending, (state, action) => {
      state.subs.loadingStatus = true;
    });
    builder.addCase(changeNumberOfTasks.pending, (state, action) => {
      state.tasks.loadingStatus = true;
    });
    builder.addMatcher(
      (action) =>
        action.type.search("changeNumberOfHeads") >= 0 &&
        action.type !== changeNumberOfHeads.pending().type,
      (state, action) => {
        state.heads.loadingStatus = false;
      }
    );
    builder.addMatcher(
      (action) =>
        action.type.search("changeNumberOfSubs") >= 0 &&
        action.type !== changeNumberOfSubs.pending().type,
      (state, action) => {
        state.subs.loadingStatus = false;
      }
    );
    builder.addMatcher(
      (action) =>
        action.type.search("changeNumberOfTasks") >= 0 &&
        action.type !== changeNumberOfTasks.pending().type,
      (state, action) => {
        state.tasks.loadingStatus = false;
      }
    );
  },
});

const { addHeads, addSubs, deleteHeads, deleteSubs } = addTasksSlice.actions;

export const changeNumberOfHeads = createAsyncThunk(
  "addTasks/changeNumberOfHeads",
  async (headNum, { dispatch }) => {
    const headIndexes = [...Array(headNum)];

    await headIndexes.reduce(async (promise, _) => {
      await promise;

      const head = { name: "", readOnly: false };
      const [newHead] = await dispatch(
        addTasksQuerySlice.endpoints.addHeads.initiate([head])
      ).unwrap();

      const modifiedHead = {
        ...newHead,
        id: newHead._id.toString(),
      };
      dispatch(addHeads([modifiedHead]));

      await dispatch(
        changeNumberOfSubs({
          num: 1,
          headId: modifiedHead.id,
        })
      );
    }, Promise.resolve());
  }
);

export const changeNumberOfSubs = createAsyncThunk(
  "addTasks/changeNumberOfSubs",
  async ({ num, headId }, { dispatch }) => {
    const subIndexes = [...Array(num)];

    await subIndexes.reduce(async (promise, _) => {
      await promise;

      const sub = { name: "", headId, readOnly: false };
      const [newSub] = await dispatch(
        addTasksQuerySlice.endpoints.addSubs.initiate([sub])
      ).unwrap();

      const modifiedSub = {
        ...newSub,
        id: newSub._id.toString(),
      };
      dispatch(addSubs([modifiedSub]));

      await dispatch(
        changeNumberOfTasks({
          num: 1,
          subId: modifiedSub.id,
          headId,
        })
      );
    }, Promise.resolve());
  }
);

export const changeNumberOfTasks = createAsyncThunk(
  "addTasks/changeNumberOfTasks",
  async ({ num, headId, subId }, { dispatch }) => {
    const tasks = [...Array(num)].fill({
      name: "",
      subId,
      headId,
    });
    const newTasks = await dispatch(
      addTasksQuerySlice.endpoints.addTasks.initiate(tasks)
    ).unwrap();
    const modifiedNewTasks = newTasks.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));
    console.log(modifiedNewTasks, " jdsfkla");
    dispatch(addTasks(modifiedNewTasks));
  }
);

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
        dispatch(addHeads([{ id: head._id, name: head.name, readOnly: true }]));

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
      console.log(sub, " head in addTaskToSub");

      // add the data of head
      dispatch(addHeads([{ id: head._id, name: head.name, readOnly: true }]));

      // add the data of sub
      dispatch(
        addSubs([
          {
            id: sub._id,
            name: sub.name,
            readOnly: true,
            headId,
          },
        ])
      );

      const tasks = getTasksOfSub(getState());

      if (!tasks.length)
        dispatch(changeNumberOfTasks({ num: 1, subId, headId }));
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
  addTasks,
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
  [getSubsEntities, (state, headId) => headId],
  (subs, headId) => {
    return subs
      .filter((sub) => {
        return sub.headId === headId;
      })
      .map((sub) => sub.id);
  }
);
export const getTasksOfSub = createSelector(
  [getTasksEntities, (state, subId) => subId],
  (tasks, subId) => {
    return tasks
      .filter((task) => {
        return task.subId === subId;
      })
      .map((task) => task.id);
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
export const getSubsLoadingStatus = createSelector(
  [getSubsOfHead, (state) => state.addTasks.subs.loadingStatus],
  (subs, loadingStatus) => {
    return subs.length === 0 && loadingStatus;
  }
);
export const getTasksLoadingStatus = createSelector(
  [getTasksOfSub, (state) => state.addTasks.tasks.loadingStatus],
  (tasks, loadingStatus) => {
    return tasks.length === 0 && loadingStatus;
  }
);

export const getHeadsLoadingStatus = (state) =>
  state.addTasks.heads.loadingStatus;
export const getCurrentHead = (state) => state.addTasks.heads.currentHead;
export const getCurrentSub = (state) => state.addTasks.subs.currentSub;
export const getCurrentTask = (state) => state.addTasks.tasks.currentTask;

export const { useAddAllMutation, useAddSubToHeadMutation } =
  addTasksQuerySlice;
