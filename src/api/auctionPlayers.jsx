import settings from "../config/settings";

export default {
  getAuctionPlayers: async (id, signal) => {
    const result = await fetch(`${settings.BaseUrl}/auction/${id}/players`, {
      credentials: "include",
      signal,
    });
    return result;
  },

  addAuctionPlayer: async (id, player, signal) => {
    const result = await fetch(`${settings.BaseUrl}/auction/${id}/players`, {
      method: "POST",
      body: JSON.stringify({ player: player }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal,
    });
    return result;
  },

  updateAuctionPlayer: async (id, player, signal) => {
    const result = await fetch(`${settings.BaseUrl}/auction/${id}/players`, {
      method: "PUT",
      body: JSON.stringify({ player: player }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal,
    });
    return result;
  },

  deleteAuctionPlayer: async (id, player, signal) => {
    const result = await fetch(`${settings.BaseUrl}/auction/${id}/players`, {
      method: "DELETE",
      body: JSON.stringify({ player: player }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal,
    });
    return result;
  },
};
