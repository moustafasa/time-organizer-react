import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const headsAdapter = createEntityAdapter();
const subsAdapter = createEntityAdapter();
const tasksAdapter = createEntityAdapter();

const tasks = tasksAdapter.getInitialState();
const subs = subsAdapter.getInitialState();
const heads = headsAdapter.getInitialState();

const initialState = {
  tasks,
  subs,
  heads,
};

const showTasksQuerySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query({
      query: ({ page, args }) => {
        const searchParams = new URLSearchParams(args);
        console.log(page);
        return {
          url: `/${page}?${searchParams.toString()}`,
        };
      },
      transformResponse: (resData, _, args) => {
        console.log(resData);
        const adapter = {
          heads: headsAdapter,
          subs: subsAdapter,
          tasks: tasksAdapter,
        };
        return adapter[args.page].setAll(initialState[args.page], resData);
      },
      providesTags: (result = { ids: [] }, error, args) => [
        { type: "Data", id: "LIST" },
        { type: "Data", id: args.page },
        ...result.ids.map((id) => ({ type: "Data", id })),
      ],
    }),
    editData: builder.mutation({
      query: ({ page, id, update }) => ({
        url: `/${page}/${id}`,
        method: "PATCH",
        data: update,
      }),
      invalidatesTags: (result, error, args) => {
        const tags = [{ type: "Data", id: args.id }];

        if (args.headId) {
          tags.push({ type: "Data", id: args.headId });
        }

        if (args.subId) {
          tags.push({ type: "Data", id: args.subId });
        }
        return tags;
      },
    }),
    deleteElement: builder.mutation({
      query: ({ page, id }) => ({
        url: `/${page}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, args) => {
        const tags = [{ type: "Data", id: args.page }];

        if (args.headId) {
          tags.push({ type: "Data", id: args.headId });
        }

        if (args.subId) {
          tags.push({ type: "Data", id: args.subId });
        }
        return tags;
      },
    }),
    deleteMultiple: builder.mutation({
      query: ({ page, ids }) => ({
        url: `/${page}/deleteMulti`,
        method: "POST",
        data: ids,
      }),
      invalidatesTags: (result, err, args) => {
        const tags = [{ type: "Data", id: args.page }];

        if (args.headId) {
          tags.push({ type: "Data", id: args.headId });
        }

        if (args.subId) {
          tags.push({ type: "Data", id: args.subId });
        }
        return tags;
      },
    }),
  }),
});

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
});

export const {
  selectIds: getAllTasksIds,
  selectById: getTasksById,
  selectEntities: getAllTasksEntities,
} = tasksAdapter.getSelectors((state) => state ?? tasks);

export const {
  selectIds: getAllSubsIds,
  selectById: getSubsById,
  selectEntities: getAllSubsEntities,
} = subsAdapter.getSelectors((state) => state ?? subs);
export const {
  selectIds: getAllHeadsIds,
  selectById: getHeadsById,
  selectEntities: getAllHeadsEntities,
} = headsAdapter.getSelectors((state) => {
  return state ?? heads;
});

export const getAllDataIds = createSelector(
  [(state) => state, (state, page) => page],
  (state, page) => {
    const data = {
      tasks: getAllTasksIds,
      subs: getAllSubsIds,
      heads: getAllHeadsIds,
    };
    return data[page](state);
  }
);

export const getElementById = createSelector(
  [(state) => state, (state, page) => page, (state, page, id) => id],
  (state, page, id) => {
    const data = {
      tasks: getTasksById,
      subs: getSubsById,
      heads: getHeadsById,
    };

    return data[page](state, id);
  }
);

export const getNotDoneTasks = createSelector(
  getAllTasksEntities,
  (state) => {
    const ids = getAllTasksIds(state);
    const entities = getAllTasksEntities(state);
    return ids.filter((id) => entities[id]?.progress < 100);
  },
  (entities, ids) => Object.fromEntries(ids.map((id) => [id, entities[id]]))
);

export const {
  useGetDataQuery,
  useEditDataMutation,
  useDeleteElementMutation,
  useDeleteMultipleMutation,
} = showTasksQuerySlice;

export const { changeCurrentHead, changeCurrentSub, changeCurrentPage } =
  showTasksSlice.actions;
export default showTasksSlice.reducer;
