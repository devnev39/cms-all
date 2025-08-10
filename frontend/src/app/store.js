import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import catererReducer from "../features/user/catererSlice";
import itemReducer from "../features/user/itemSlice";
import cartReducer from "../features/user/cartSlice";
import orderReducer from "../features/user/orderSlice";
import couponTypeReducer from "../features/user/couponTypeSlice";
import couponReducer from "../features/user/couponSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    caterer: catererReducer,
    item: itemReducer,
    cart: cartReducer,
    order: orderReducer,
    couponType: couponTypeReducer,
    coupon: couponReducer,
  },
});
