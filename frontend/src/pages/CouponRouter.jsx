import React from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import CouponCustomer from "./customer/Coupons";
import CouponClient from "./client/Coupons";

function CouponRouter() {
  const { user } = useCurrentUser();
  return user && user.role.type === "ROLE_CSTMR" ? (
    <CouponCustomer />
  ) : (
    <CouponClient />
  );
}

export default CouponRouter;
