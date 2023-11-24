import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const headsAdapter = createEntityAdapter();
const subsAdapter = createEntityAdapter();
const tasksAdapter = createEntityAdapter();

const initialState = {
  heads: headsAdapter.getInitialState(),
  subs: subsAdapter.getInitialState(),
  tasks: tasksAdapter.getInitialState(),
};

export const fetchData = createAsyncThunk(
  "showTasks/fetchData",
  async (page) => {
    const res = await axios.get("http://localhost:3000/" + page);
    return res.data;
  }
);

const showTasksSlice = createSlice({
  name: "showTasks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      headsAdapter.setMany(state.heads, action.payload);
    });
  },
});

export const { selectAll: getAllHeads } = headsAdapter.getSelectors(
  (state) => state.showTasks.heads
);
export const { selectAll: getAllSubs } = subsAdapter.getSelectors(
  (state) => state.showTasks.subs
);
export const { selectAll: getAllTasks } = tasksAdapter.getSelectors(
  (state) => state.showTasks.tasks
);

export default showTasksSlice.reducer;
