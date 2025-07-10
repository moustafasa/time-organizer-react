import { apiSlice } from "../api/apiSlice";
import { logOut, setCredintials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "post",
        data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(setCredintials(res.data));
        } catch (err) {}
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "post",
        data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(setCredintials(res.data));
        } catch (err) {}
      },
    }),
    refresh: builder.mutation({
      query: () => "/refresh",
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(setCredintials(res.data));
        } catch (err) {
          dispatch(logOut());
        }
      },
    }),
    logout: builder.mutation({
      query: () => "/logout",
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        await queryFulfilled;
        dispatch(logOut());
      },
    }),
  }),
});

export const { useRefreshMutation, useLoginMutation, useLogoutMutation } =
  authApiSlice;
export default authApiSlice;
