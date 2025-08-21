import { useSelector } from "react-redux";
import { getCurrentToken } from "./authSlice";
import { Navigate, Outlet, useNavigation } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

const RequireAuth = () => {
  const token = useSelector(getCurrentToken);
  const navigation = useNavigation();
  return navigation.state === "submitting" || token === null ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Spinner size="large" showLabel />
    </div>
  ) : token ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?from=${window.location.pathname}`} replace />
  );
};

export default RequireAuth;
