import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    removeUser: (state, action) => {
      // remove user from users array
      if (state.users) {
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
      }
    },
    updateUser: (state, action) => {
      // update user in users array
      if (state.users) {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      }
    },
  },
});

export const { setUser, setUsers, removeUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
