import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ACCESS_TOKEN_KEY, getItem } from "../Utils/localStorageManager";

function OnlyIfnotLogin() {
  const user = getItem(ACCESS_TOKEN_KEY);

  return user ? <Navigate to="/" /> : <Outlet />;
}

export default OnlyIfnotLogin;
