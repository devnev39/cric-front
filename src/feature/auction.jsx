import { createSlice } from "@reduxjs/toolkit";

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    auction: {},
  },
  reducers: {
    updateAuction: (state, action) => {
      state.auction = {
        ...state.auction,
        ...action.payload,
      };
    },
  },
});

export const { updateAuction } = auctionSlice.actions;
export default auctionSlice.reducer;
