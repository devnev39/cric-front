import settings from "../config/settings";

export default {
  query: async (queries, signal) => {
    const result = await fetch(`${settings.BaseUrl}/player/query`, {
      credentials: "include",
      body: JSON.stringify({ queries }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    });
    return result;
  },
};
