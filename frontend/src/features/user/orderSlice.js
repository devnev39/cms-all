import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload.id
      );
    },
  },
});

export const { setOrders, addOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;
