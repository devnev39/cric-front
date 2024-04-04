import settings from "../config/settings";

export default {
  getUsers: async (signal) => {
    const result = await fetch(`${settings.BaseUrl}/users`, {
      method: "GET",
      credentials: "include",
      signal,
    });
    return result;
  },

  addUser: async (tempUser, signal) => {
    const result = await fetch(`${settings.BaseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tempUser }),
      credentials: "include",
      signal,
    });
    return result;
  },

  updateUser: async (id, tempUser, signal) => {
    const result = await fetch(`${settings.BaseUrl}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tempUser }),
      signal,
      credentials: "include",
    });
    return result;
  },

  deleteUser: async (id, tempUser, signal) => {
    const result = await fetch(`${settings.BaseUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
      body: JSON.stringify({ tempUser }),
      credentials: "include",
    });
    return result;
  },
};
