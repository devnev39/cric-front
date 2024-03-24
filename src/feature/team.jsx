import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    teams: [],
    observableTeam: {},
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
      const ind = state.teams.findIndex((t) => t._id == action.payload._id);
      state.teams = state.teams.filter((t) => t._id != action.payload._id);
      state.teams.splice(ind, 0, action.payload);
    },

    setObservableTeam: (state, action) => {
      state.observableTeam = action.payload;
    },

    updateObservableTeam: (state, action) => {
      if (action.payload.sold) {
        state.observableTeam.players = state.observableTeam.players.concat(
            action.payload,
        );
      } else {
        state.observableTeam.players = state.observableTeam.players.filter(
            (p) => p._id != action.payload._id,
        );
      }
    },
  },
});

export const {
  setTeams,
  addTeam,
  removeTeam,
  updateTeam,
  setObservableTeam,
  updateObservableTeam,
} = teamSlice.actions;
export default teamSlice.reducer;
