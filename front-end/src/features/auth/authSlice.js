import { createSlice } from "@reduxjs/toolkit";

const initialState = { token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredintials(state, action) {
      state.token = action.payload.accessToken;
    },

    logOut(state, action) {
      state.token = "";
    },
  },
});

export const { setCredintials, logOut, setRefreshedTrue } = authSlice.actions;
export default authSlice.reducer;
export const getCurrentToken = (state) => state.auth.token;
