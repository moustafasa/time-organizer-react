import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "post",
        data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "post",
        data,
      }),
    }),
    refresh: builder.mutation({
      query: () => "/refresh",
    }),
  }),
});

export const { useRefreshMutation, useLoginMutation } = authApiSlice;
export default authApiSlice;
