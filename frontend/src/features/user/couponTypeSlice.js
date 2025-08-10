import { createSlice } from "@reduxjs/toolkit";

const couponTypeSlice = createSlice({
  name: "couponType",
  initialState: {
    couponTypes: [],
  },
  reducers: {
    setCouponTypes: (state, action) => {
      state.couponTypes = action.payload;
    },
    addCouponType: (state, action) => {
      state.couponTypes.push(action.payload);
    },
    updateCouponType: (state, action) => {
      const index = state.couponTypes.findIndex(
        (couponType) => couponType.id === action.payload.id
      );
      if (index !== -1) {
        state.couponTypes[index] = action.payload;
      }
    },
    removeCouponType: (state, action) => {
      state.couponTypes = state.couponTypes.filter(
        (couponType) => couponType.id !== action.payload.id
      );
    },
  },
});

export const {
  setCouponTypes,
  addCouponType,
  updateCouponType,
  removeCouponType,
} = couponTypeSlice.actions;
export default couponTypeSlice.reducer;
