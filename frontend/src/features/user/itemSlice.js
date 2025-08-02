import { createSlice } from "@reduxjs/toolkit";

const itemSlice = createSlice({
  name: "item",
  initialState: {
    items: [],
    item: {},
  },
  reducers: {
    setItem: (state, action) => {
      state.item = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { setItem, setItems, removeItem, updateItem } = itemSlice.actions;
export default itemSlice.reducer;
