import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ClientDashboard from "./ClientDashboard";
import Clients from "../admin/Clients";

function Dashboard() {
  // Get current user
  // Depending on role render admin, client and customer dashboard along with menu
  const { user } = useCurrentUser();

  return user && user?.role?.type === "ROLE_CLNT" ? (
    <ClientDashboard />
  ) : (
    <Clients />
  );
}

export default Dashboard;
