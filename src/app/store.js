import { configureStore } from "@reduxjs/toolkit";
import auctionReducer from "../feature/auction";
import ruleReducer from "../feature/rule";
import teamReducer from "../feature/team";

export default configureStore({
  reducer: {
    auction: auctionReducer,
    rule: ruleReducer,
    team: teamReducer,
  },
});
