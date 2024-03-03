import { createSlice } from "@reduxjs/toolkit";

const ruleSlice = createSlice({
  name: "rule",
  initialState: {
    rules: [],
  },
  reducers: {
    setRules: (state, action) => {
      state.rules = action.payload;
    },
    updateRules: (state, action) => {
      state.rules = state.rules.concat(action.payload);
    },
    removeRule: (state, action) => {
      state.rules = state.rules.filter((r) => r._id != action.payload);
    },
  },
});

export const { updateRules, removeRule, setRules } = ruleSlice.actions;
export default ruleSlice.reducer;
