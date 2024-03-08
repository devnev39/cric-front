import { configureStore } from "@reduxjs/toolkit";
import auctionReducer from "../feature/auction";
import ruleReducer from "../feature/rule";
import teamReducer from "../feature/team";
import auctionPlayersReducer from "../feature/auctionPlayers";

export default configureStore({
  reducer: {
    auction: auctionReducer,
    rule: ruleReducer,
    team: teamReducer,
    auctionPlayers: auctionPlayersReducer,
  },
});
