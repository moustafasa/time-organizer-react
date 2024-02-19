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
    getHeads: builder.query({
      query: () => "/heads",
      transformResponse: (resData, _, args) =>
        headsAdapter.setAll(initialState.heads, resData),
      providesTags: (result = { ids: [] }, error, args) => [
        { type: "Heads", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Heads", id })),
      ],
    }),
    getSubs: builder.query({
      query: (args) => {
        return `/subs?${args}`;
      },
      transformResponse: (resData, _, args) => {
        return subsAdapter.setAll(initialState.tasks, resData);
      },
      providesTags: (result = { ids: [] }, error, args) => [
        { type: "Subs", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Subs", id })),
      ],
    }),
    getTasks: builder.query({
      query: (args) => {
        return `/tasks?${args}`;
      },
      transformResponse: (resData, _, args) => {
        return tasksAdapter.setAll(initialState.tasks, resData);
      },
      providesTags: (result = { ids: [] }, error, args) => [
        { type: "Tasks", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Tasks", id })),
      ],
    }),
    editData: builder.mutation({
      query: ({ page, id, update }) => ({
        url: `/${page}/${id}`,
        method: "PATCH",
        data: update,
      }),
      invalidatesTags: (result, error, args) => {
        const tagType = args.page[0].toUpperCase() + args.page.slice(1);
        const tags = [{ type: tagType, id: args.id }];

        if (args.headId) {
          tags.push({ type: "Heads", id: args.headId });
        }

        if (args.subId) {
          tags.push({ type: "Subs", id: args.subId });
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
      // invalidatesTags: (result, err, args) => {
      //   const tagType = args.page[0].toUpperCase() + args.page.slice(1);

      //   const tags = [{ type: tagType, id: args.page }];

      //   if (args.headId) {
      //     tags.push({ type: "Heads", id: args.headId });
      //   }

      //   if (args.subId) {
      //     tags.push({ type: "Subs", id: args.subId });
      //   }
      //   return tags;
      // },
      async onQueryStarted(
        { page, ids, ...rest },
        { dispatch, queryFulfilled }
      ) {
        const endPoint = `get${page[0].toUpperCase() + page.slice(1)}`;

        console.log(window.location.search.slice(1));

        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            endPoint,
            window.location.search.slice(1),
            (draft) => {
              console.log(draft);
              draft = draft.filter((element) => !ids.includes(element.id));
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  selectIds: getAllTasksIds,
  selectById: getTasksById,
  selectAll: getAllTasks,
} = tasksAdapter.getSelectors((state) => state ?? tasks);

export const {
  selectIds: getAllSubsIds,
  selectById: getSubsById,
  selectAll: getAllSubs,
} = subsAdapter.getSelectors((state) => state ?? subs);
export const {
  selectIds: getAllHeadsIds,
  selectById: getHeadsById,
  selectAll: getAllHeads,
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

export const getNotDoneTasks = createSelector(getAllTasks, (tasks) =>
  tasks.filter((task) => task?.progress < 100)
);

export const {
  useGetHeadsQuery,
  useGetSubsQuery,
  useGetTasksQuery,
  useEditDataMutation,
  useDeleteElementMutation,
  useDeleteMultipleMutation,
} = showTasksQuerySlice;
