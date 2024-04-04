import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import auctionReducer from "../feature/auction";
import ruleReducer from "../feature/rule";
import teamReducer from "../feature/team";
import auctionPlayersReducer from "../feature/auctionPlayers";
import countryCodeReducer from "../feature/countries";
import usersReducer from "../feature/users";

export default configureStore({
  reducer: {
    auction: auctionReducer,
    rule: ruleReducer,
    team: teamReducer,
    auctionPlayers: auctionPlayersReducer,
    countryCodes: countryCodeReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
