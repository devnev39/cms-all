import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import catererReducer from "../features/user/catererSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    caterer: catererReducer,
  },
});
