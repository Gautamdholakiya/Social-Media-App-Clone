import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getItem, ACCESS_TOKEN_KEY } from "../Utils/localStorageManager";

function RequierUser() {
  const user = getItem(ACCESS_TOKEN_KEY);
  return user ? <Outlet /> : <Navigate to="/Login" />;
}

export default RequierUser;
