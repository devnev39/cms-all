import { createSlice } from "@reduxjs/toolkit";

const catererSlice = createSlice({
  name: "caterer",
  initialState: {
    caterer: null, // For client
    caterers: [], // For admin
  },
  reducers: {
    setCaterer: (state, action) => {
      state.caterer = action.payload;
    },

    setCaterers: (state, action) => {
      state.caterers = action.payload;
    },
    addCaterer: (state, action) => {
      if (!state.caterers) {
        state.caterers = [];
      }
      state.caterers.push(action.payload);
    },
    removeCaterer: (state, action) => {
      if (state.caterers) {
        state.caterers = state.caterers.filter(
          (caterer) => caterer.id !== action.payload.id
        );
      }
    },
    updateCaterer: (state, action) => {
      if (state.caterers) {
        const index = state.caterers.findIndex(
          (caterer) => caterer.id === action.payload.id
        );
        if (index !== -1) {
          state.caterers[index] = action.payload;
        }
      }
    },
  },
});

export const {
  setCaterers,
  removeCaterer,
  updateCaterer,
  addCaterer,
  setCaterer,
} = catererSlice.actions;
export default catererSlice.reducer;
