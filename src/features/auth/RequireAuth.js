import { useDispatch, useSelector } from "react-redux";
import { getCurrentToken, setCredintials } from "./authSlice";
import { useRefreshMutation } from "./authApiSlice";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const token = useSelector(getCurrentToken);
  const [refresh, { isLoading }] = useRefreshMutation();
  const dispatch = useDispatch();

  console.log(token, isLoading);
  useEffect(() => {
    const getData = async () => {
      const res = refresh();
      if (res?.data) dispatch(setCredintials(res.data));
    };
    if (!token) getData();
  }, [token, dispatch, refresh]);

  return token ? <Outlet /> : isLoading ? <p>...loading</p> : <h2>dfsado</h2>;
  // <Navigate to={"/login"} />
};

export default RequireAuth;
