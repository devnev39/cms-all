import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    addToCart: (state, action) => {
      state.cart = state.cart.concat({
        item: action.payload.item,
        count: action.payload.count,
      });
    },
    addOneMoreToCart: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.item.id === action.payload.id) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
    },
    removeOneFromCart: (state, action) => {
      const item = state.cart.filter(
        (item) => item.item.id === action.payload.id
      );
      if (item.length === 0) return;

      if (item[0].count === 1) {
        state.cart = state.cart.filter(
          (item) => item.item.id !== action.payload.id
        );
      } else {
        item[0].count = item[0].count - 1;
      }
      // state.cart = state.cart.map((item) => {
      //   if (item.item.id === action.payload.id) {
      //     return { ...item, count: item.count - 1 };
      //   }
      // return item;
      // });
    },
    removeFromCart: (state, action) => {
      console.log(action.payload);
      state.cart = state.cart.filter(
        (item) => item.item.id !== action.payload.id
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  addOneMoreToCart,
  removeOneFromCart,
  setCart,
} = cartSlice.actions;
export default cartSlice.reducer;
