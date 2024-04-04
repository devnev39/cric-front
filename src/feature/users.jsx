import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = state.users.concat(action.payload);
    },

    updateUser: (state, action) => {
      const index = state.users.findIndex((u) => u._id == action.payload._id);
      state.users = state.users.filter((u) => u._id != action.payload._id);
      state.users.splice(index, 0, action.payload);
    },

    removeUser: (state, action) => {
      state.users = state.users.filter((u) => u._id != action.payload._id);
    },
  },
});

export const { setUsers, updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
