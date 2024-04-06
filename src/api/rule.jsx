import settings from "../config/settings";

export default {
  getRules: async (id, signal) => {
    const result = await fetch(`${settings.BaseUrl}/rule/${id}`, {
      credentials: "include",
      signal: signal,
    });
    return result;
  },

  getAllRules: async (signal) => {
    const result = await fetch(`${settings.BaseUrl}/rule`, {
      credentials: "include",
      signal,
    });
    return result;
  },

  addRule: async (rule, signal) => {
    const result = await fetch(`${settings.BaseUrl}/rule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rule: rule }),
      credentials: "include",
      signal: signal,
    });
    return result;
  },

  deleteRule: async (id, signal) => {
    const result = await fetch(`${settings.BaseUrl}/rule/${id}`, {
      method: "DELETE",
      credentials: "include",
      signal: signal,
    });
    return result;
  },
};
