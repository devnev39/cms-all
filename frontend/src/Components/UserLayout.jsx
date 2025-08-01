import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Outlet } from "react-router";

function UserLayout() {
  const { user } = useCurrentUser();
  return (
    <>
      <Outlet />
    </>
  );
}

export default UserLayout;
