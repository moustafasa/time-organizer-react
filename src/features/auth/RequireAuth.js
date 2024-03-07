import { useSelector } from "react-redux";
import { getCurrentToken } from "./authSlice";

import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const token = useSelector(getCurrentToken);

  return token ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?from=${window.location.pathname}`} />
  );
};

export default RequireAuth;
