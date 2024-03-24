import { createSlice } from "@reduxjs/toolkit";

const auctionPlayersSlice = createSlice({
  name: "auctionPlayers",
  initialState: {
    players: [],
    customPlayers: [],
  },
  reducers: {
    setPlayers: (state, action) => {
      state.players = action.payload;
    },

    setCustomPlayers: (state, action) => {
      state.customPlayers = action.payload;
    },

    addPlayer: (state, action) => {
      state.players = state.players.concat(action.payload);
    },

    addPlayerCustom: (state, action) => {
      state.customPlayers = state.customPlayers.concat(action.payload);
    },

    updatePlayer: (state, action) => {
      const ind = state.players.findIndex((p) => p._id == action.payload._id);
      state.players = state.players.filter((p) => p._id != action.payload._id);
      state.players.splice(ind, 0, action.payload);
    },

    removePlayer: (state, action) => {
      state.players = state.players.filter((p) => p._id != action.payload);
    },

    removePlayerCustom: (state, action) => {
      state.customPlayers = state.customPlayers.filter(
          (p) => p._id != action.payload,
      );
    },
  },
});

export const {
  setPlayers,
  setCustomPlayers,
  addPlayer,
  addPlayerCustom,
  removePlayer,
  removePlayerCustom,
  updatePlayer,
} = auctionPlayersSlice.actions;
export default auctionPlayersSlice.reducer;
