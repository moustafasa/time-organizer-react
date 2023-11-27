import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const headsAdapter = createEntityAdapter();
const subsAdapter = createEntityAdapter();
const tasksAdapter = createEntityAdapter();

const initialState = {
  tasks: tasksAdapter.getInitialState(),
  subs: subsAdapter.getInitialState({ currentSub: "" }),
  heads: headsAdapter.getInitialState({ currentHead: "" }),
  page: "heads",
};

export const fetchData = createAsyncThunk(
  "showTasks/fetchData",
  async ({ page, args }) => {
    if (page !== "heads" && !args) {
      return { data: [], page };
    }

    const params =
      page !== "heads"
        ? `?headId=${args.headId}${
            page === "tasks" ? `&subId=${args.subId}` : ""
          }`
        : "";

    const res = await axios.get("http://localhost:3000/" + page + params);

    return { data: res.data, page };
  }
);

export const updateItem = createAsyncThunk(
  "showTasks/updateItem",
  async ({ id, update }, { getState }) => {
    const page = getState().showTasks.page;
    const res = await axios.patch(
      `http://localhost:3000/${page}/${id}`,
      update
    );
    return { id, update: res.data };
  }
);

export const deleteItem = createAsyncThunk(
  "showTasks/deleteItem",
  async (id, { getState }) => {
    const page = getState().showTasks.page;
    await axios.delete(`http://localhost:3000/${page}/${id}`);
    return id;
  }
);

export const deleteMultiple = createAsyncThunk(
  "showTasks/deleteMultiple",
  async (ids, { getState }) => {
    const page = getState().showTasks.page;
    await axios.post(`http://localhost:3000/${page}/deleteMulti`, ids);
    return ids;
  }
);

const showTasksSlice = createSlice({
  name: "showTasks",
  initialState: initialState,
  reducers: {
    changeCurrentHead(state, action) {
      state.heads.currentHead = action.payload;
    },
    changeCurrentSub(state, action) {
      state.subs.currentSub = action.payload;
    },
    changeCurrentPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        const adapter = {
          tasks: tasksAdapter,
          subs: subsAdapter,
          heads: headsAdapter,
        };
        adapter[action.payload.page].setAll(
          state[action.payload.page],
          action.payload.data
        );
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const adapter = {
          tasks: tasksAdapter,
          subs: subsAdapter,
          heads: headsAdapter,
        };
        adapter[state.page].updateOne(state[state.page], {
          id: action.payload.id,
          changes: action.payload.update,
        });
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        const adapter = {
          tasks: tasksAdapter,
          subs: subsAdapter,
          heads: headsAdapter,
        };
        adapter[state.page].removeOne(state[state.page], action.payload);
      })
      .addCase(deleteMultiple.fulfilled, (state, action) => {
        const adapter = {
          tasks: tasksAdapter,
          subs: subsAdapter,
          heads: headsAdapter,
        };
        adapter[state.page].removeMany(state[state.page], action.payload);
      });
  },
});

export const { selectIds: getAllTasksIds, selectById: getTasksById } =
  tasksAdapter.getSelectors((state) => state.showTasks.tasks);
export const {
  selectIds: getAllSubsIds,
  selectById: getSubsById,
  selectEntities: getAllSubsEntities,
} = subsAdapter.getSelectors((state) => state.showTasks.subs);
export const {
  selectIds: getAllHeadsIds,
  selectById: getHeadsById,
  selectEntities: getAllHeadsEntities,
} = headsAdapter.getSelectors((state) => state.showTasks.heads);

export const getAllDataIds = createSelector(
  [(state) => state.showTasks.page, (state) => state],
  (page, state) => {
    const data = {
      tasks: getAllTasksIds,
      subs: getAllSubsIds,
      heads: getAllHeadsIds,
    };
    return data[page](state);
  }
);

export const getElementById = createSelector(
  [(state) => state.showTasks.page, (state) => state, (state, id) => id],
  (page, state, id) => {
    const data = {
      tasks: getTasksById,
      subs: getSubsById,
      heads: getHeadsById,
    };

    return data[page](state, id);
  }
);

export const getCurrentHead = (state) => state.showTasks.heads.currentHead;
export const getCurrentSub = (state) => state.showTasks.subs.currentSub;
export const getCurrentPage = (state) => state.showTasks.page;

export const { changeCurrentHead, changeCurrentSub, changeCurrentPage } =
  showTasksSlice.actions;
export default showTasksSlice.reducer;
