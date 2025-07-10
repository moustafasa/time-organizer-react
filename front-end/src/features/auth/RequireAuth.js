import { useSelector } from "react-redux";
import { getCurrentToken } from "./authSlice";
import { Navigate, Outlet, useNavigation } from "react-router-dom";

const RequireAuth = () => {
  const token = useSelector(getCurrentToken);
  const navigation = useNavigation();
  return navigation.state === "submitting" || token === null ? (
    <p>require loading...</p>
  ) : token ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?from=${window.location.pathname}`} replace />
  );
};

export default RequireAuth;
