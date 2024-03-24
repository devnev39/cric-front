import { createSlice } from "@reduxjs/toolkit";

const countrySlice = createSlice({
  name: "country",
  initialState: {
    countryCodes: {},
  },
  reducers: {
    setCountryCodes: (state, action) => {
      state.countryCodes = action.payload;
    },
  },
});

export const { setCountryCodes } = countrySlice.actions;
export default countrySlice.reducer;
