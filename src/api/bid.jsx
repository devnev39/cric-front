import settings from "../config/settings";

export default {
  placeBid: async (id, player, team, soldPrice, signal) => {
    const result = await fetch(`${settings.BaseUrl}/auction/${id}/bid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player, team, soldPrice }),
      signal: signal,
      credentials: "include",
    });
    return result;
  },

  revertBid: async (id, player, signal) => {
    const result = await fetch(`${settings.BaseUrl}/auction/${id}/bid`, {
      method: "DELETE",
      body: JSON.stringify({ player }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: signal,
    });
    return result;
  },
};
