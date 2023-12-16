import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

const axiosBaseQuery =
  ({ baseUrl = { baseUrl: "" } }) =>
  async (config) => {
    try {
      let res;
      if (typeof config === "string") {
        res = await axios({
          url: baseUrl + config,
        });
      } else {
        const { url, method, data, headers } = config;
        res = await axios({
          url: baseUrl + url,
          method,
          data,
          headers,
        });
      }
      return { data: res.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Data", "RunTasks"],
  endpoints: (builder) => ({
    getElement: builder.query({
      query: ({ type, id }) => `/${type}/${id}`,
    }),
  }),
});

export const { useGetElementQuery } = apiSlice;
