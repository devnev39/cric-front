import settings from "../config/settings";

export default {
  getTeams: async (id, signal) => {
    const result = await fetch(`${settings.BaseUrl}/team/auction/${id}`, {
      credentials: "include",
      signal: signal,
    });
    return result;
  },

  addTeam: async (team, signal) => {
    const result = await fetch(`${settings.BaseUrl}/team`, {
      credentials: "include",
      signal: signal,
      body: JSON.stringify({ team: team }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result;
  },

  deleteTeam: async (id, signal) => {
    const result = await fetch(`${settings.BaseUrl}/team/${id}`, {
      credentials: "include",
      signal: signal,
      method: "DELETE",
    });
    return result;
  },

  updateTeam: async (id, team, signal) => {
    const result = await fetch(`${settings.BaseUrl}/team/${id}`, {
      credentials: "include",
      signal: signal,
      body: JSON.stringify({ team: team }),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result;
  },
};
