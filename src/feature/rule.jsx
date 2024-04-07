import { createSlice } from "@reduxjs/toolkit";

const ruleSlice = createSlice({
  name: "rule",
  initialState: {
    rules: [],
    sampleRules: [],
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
    setSampleRules: (state, action) => {
      for (const rule of action.payload) {
        if (state.sampleRules.filter((r) => r.rule == rule.rule).length == 0) {
          state.sampleRules.push(rule);
        }
      }
    },
  },
});

export const { updateRules, removeRule, setRules, setSampleRules } =
  ruleSlice.actions;
export default ruleSlice.reducer;
