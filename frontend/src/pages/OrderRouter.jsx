import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Orders as CustomerOrders } from "./customer/Orders";
import { Orders as ClientOrders } from "./client/Orders";

function OrderRouter() {
  const { user } = useCurrentUser();

  return user && user?.role?.type === "ROLE_CSTMR" ? (
    <CustomerOrders />
  ) : (
    <ClientOrders />
  );
}

export default OrderRouter;
