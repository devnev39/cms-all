import { createSlice } from "@reduxjs/toolkit";

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
  },
  reducers: {
    setCoupons: (state, action) => {
      state.coupons = action.payload;
    },
    addCoupon: (state, action) => {
      state.coupons.push(action.payload);
    },
    updateCoupon: (state, action) => {
      const couponIndex = state.coupons.findIndex(
        (coupon) => coupon.id === action.payload.id
      );
      if (couponIndex != -1) {
        state.coupons[couponIndex] = action.payload;
      }
    },
    removeCoupon: (state, action) => {
      state.coupons = state.coupons.filter(
        (coupon) => coupon.id !== action.payload.id
      );
    },
  },
});

export const { setCoupons, addCoupon, updateCoupon, removeCoupon } =
  couponSlice.actions;
export default couponSlice.reducer;
