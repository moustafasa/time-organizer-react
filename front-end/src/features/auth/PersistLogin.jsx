import React, { useEffect } from "react";
import { useRefreshMutation } from "./authApiSlice";
import { Outlet } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

const PersistLogin = () => {
  const [refresh, { isLoading, isUninitialized }] = useRefreshMutation();

  useEffect(() => {
    if (isUninitialized) {
      refresh();
    }
  }, [refresh, isUninitialized]);

  return isUninitialized || isLoading ? (
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
  ) : (
    <Outlet />
  );
};

export default PersistLogin;
