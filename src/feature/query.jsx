import { createSlice } from "@reduxjs/toolkit";

const querySlice = createSlice({
  name: "query",
  initialState: {
    data: {
      price: [],
      players: [],
      countries: [],
      iplteams: [],
    },
  },
  reducers: {
    setQueryData: (state, action) => {
      state.data.countries = action.payload.countries;
      state.data.players = action.payload.players;
      state.data.iplteams = action.payload.iplteams;
      state.data.price = action.payload.price;
    },
  },
});

export const { setQueryData } = querySlice.actions;
export default querySlice.reducer;
