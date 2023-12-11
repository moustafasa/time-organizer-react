import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["heads"],
  endpoints: (builder) => ({
    getHeads: builder.query({
      query: () => "/heads",
      providesTags: ["heads"],
    }),
    getSubs: builder.query({
      query: (hId) => `/subs?headId=${hId}`,
    }),
    getTasks: builder.query({
      query: ({ headId, subId }) => `/tasks?headId=${headId}&subId=${subId}`,
    }),
    addAll: builder.mutation({
      query: (all) => ({ url: "/all", method: "POST", body: all }),
      invalidatesTags: ["heads"],
    }),
  }),
});

export const {
  useGetHeadsQuery,
  useGetSubsQuery,
  useGetTasksQuery,
  useAddAllMutation,
} = apiSlice;
