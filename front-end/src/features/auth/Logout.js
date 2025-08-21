import { redirect } from "react-router-dom";
import authApiSlice from "./authApiSlice";

export const action = (dispatch) => async () => {
  try {
    await dispatch(
      authApiSlice.endpoints.logout.initiate(undefined, {
        track: false,
      })
    ).unwrap();
  } catch (err) {}
  return redirect("/?index");
};
