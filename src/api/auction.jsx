import encrypt from "../components/common/Encrypt";
import settings from "../config/settings";

export default {
  getAll: async (signal) => {
    const resp = await fetch(`${settings.BaseUrl}/auction`, {
      credentials: "include",
      signal: signal,
    });
    return resp;
  },

  getAuction: async (id, signal) => {
    const resp = await fetch(`${settings.BaseUrl}/auction/${id}`, {
      credentials: "include",
      signal: signal,
    });
    return resp;
  },

  logoutAuction: async (signal) => {
    const resp = await fetch(`${settings.BaseUrl}/logout`, {
      credentials: "include",
      signal: signal,
    });
    return resp;
  },

  deleteAuction: async (auctionData, deleteId, signal) => {
    const resp = await fetch(`${settings.BaseUrl}/auction/${auctionData._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auction: auctionData,
        deleteId: encrypt(deleteId),
      }),
      credentials: "include",
      signal: signal,
    });
    return resp;
  },

  updateAuction: async (auctionData, signal) => {
    const resp = await fetch(`${settings.BaseUrl}/auction/${auctionData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auction: auctionData,
      }),
      credentials: "include",
      signal: signal,
    });

    return resp;
  },
};
