import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const runningTasksAdapter = createEntityAdapter();

const initialState = runningTasksAdapter.getInitialState();

export const fetchRunTasks = createAsyncThunk(
  "runningTasks/fetchRunTasks",
  async (type) => {
    const res = await axios(`http://localhost:3000/runningTasks/${type}`);
    console.log(res.data);
    return res.data;
  }
);

const RunningTasksSlice = createSlice({
  name: "runningTasks",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRunTasks.fulfilled, (state, action) => {
      runningTasksAdapter.setAll(state, action.payload);
    });
  },
});

export const { selectIds: getRunTasksIds, selectById: getRunTaskById } =
  runningTasksAdapter.getSelectors((state) => state.runningTasks);

export default RunningTasksSlice.reducer;
