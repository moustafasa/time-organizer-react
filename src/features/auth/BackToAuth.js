import React from "react";
import { useSelector } from "react-redux";
import { getCurrentToken } from "./authSlice";
import { Navigate, Outlet, useNavigation } from "react-router-dom";

const BackToAuth = () => {
  const token = useSelector(getCurrentToken);
  const navigation = useNavigation();
  return token && navigation.state === "idle" ? (
    <Navigate to={"/"} replace />
  ) : (
    <Outlet />
  );
};

export default BackToAuth;
