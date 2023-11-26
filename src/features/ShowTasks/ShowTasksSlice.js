import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const dataAdapter = createEntityAdapter();

const initialState = dataAdapter.getInitialState();

export const fetchData = createAsyncThunk(
  "showTasks/fetchData",
  async (page) => {
    const res = await axios.get("http://localhost:3000/" + page);
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        dataAdapter.setAll(state, action.payload.data);
        state.page = action.payload.page;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        dataAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload.update,
        });
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        dataAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteMultiple.fulfilled, (state, action) => {
        dataAdapter.removeMany(state, action.payload);
      });
  },
});

export const { selectIds: getAllDataIds, selectById: getElementById } =
  dataAdapter.getSelectors((state) => state.showTasks);

export default showTasksSlice.reducer;
