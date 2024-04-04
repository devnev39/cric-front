import { createSlice } from "@reduxjs/toolkit";

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    auction: {},
    auctions: [],
  },
  reducers: {
    updateAuction: (state, action) => {
      state.auction = {
        ...state.auction,
        ...action.payload,
      };
    },

    setAuctions: (state, action) => {
      state.auctions = state.auctions.concat(action.payload);
    },

    updateAuctions: (state, action) => {
      const index = state.auctions.findIndex(
          (a) => a._id == action.payload._id,
      );
      state.auctions = state.auctions.filter(
          (a) => a._id != action.payload._id,
      );
      state.auctions.splice(index, 0, action.payload);
    },

    removeAuction: (state, action) => {
      state.auctions = state.auctions.filter(
          (a) => a._id != action.payload._id,
      );
    },
  },
});

export const { updateAuction, setAuctions, updateAuctions, removeAuction } =
  auctionSlice.actions;
export default auctionSlice.reducer;
