import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    setCart: (state, action) => {
      // Always ensure cart is an array
      state.cart = Array.isArray(action.payload) ? action.payload : [];
    },
    addToCart: (state, action) => {
      const { item, count } = action.payload;

      // Defensive fallback if state.cart is null/undefined
      if (!Array.isArray(state.cart)) {
        state.cart = [];
      }

      // Check if item already exists in cart
      const existingIndex = state.cart.findIndex(
        (cartItem) => cartItem.item.id === item.id
      );

      if (existingIndex !== -1) {
        // Item exists, increase the count
        state.cart[existingIndex].count += count;
      } else {
        // New item, add to cart
        state.cart.push({ item, count });
      }
    },
    addOneMoreToCart: (state, action) => {
      state.cart = state.cart.map((cartItem) => {
        if (cartItem.item.id === action.payload.id) {
          return { ...cartItem, count: cartItem.count + 1 };
        }
        return cartItem;
      });
    },
    removeOneFromCart: (state, action) => {
      const item = state.cart.find(
        (cartItem) => cartItem.item.id === action.payload.id
      );
      if (!item) return;

      if (item.count === 1) {
        state.cart = state.cart.filter(
          (cartItem) => cartItem.item.id !== action.payload.id
        );
      } else {
        item.count = item.count - 1;
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (cartItem) => cartItem.item.id !== action.payload.id
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
