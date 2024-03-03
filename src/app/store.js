import { configureStore } from "@reduxjs/toolkit";
import auctionReducer from "../feature/auction";
import ruleReducer from "../feature/rule";

export default configureStore({
  reducer: {
    auction: auctionReducer,
    rule: ruleReducer,
  },
});
