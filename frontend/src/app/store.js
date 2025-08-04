import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import catererReducer from "../features/user/catererSlice";
import itemReducer from "../features/user/itemSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    caterer: catererReducer,
    item: itemReducer,
  },
});
