import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    teams: [],
  },
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    },

    addTeam: (state, action) => {
      state.teams = state.teams.concat(action.payload);
    },

    removeTeam: (state, action) => {
      state.teams = state.teams.filter((t) => t._id != action.payload);
    },

    updateTeam: (state, action) => {
      state.teams = state.teams.filter((t) => t._id != action.payload._id);
      state.teams = state.teams.concat(action.payload);
    },
  },
});

export const { setTeams, addTeam, removeTeam, updateTeam } = teamSlice.actions;
export default teamSlice.reducer;
