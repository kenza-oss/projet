import axios from "./axios";

export const getDashboard = async (id = 'me') => {
  try {
    const res = await axios.get(`dashboard/${id}/`);
    return res.data;
  } catch (err) {
    console.error("Dashboard fetch failed", err);
    // Fallback empty structure
    return {
      products: [],
      messages: [],
      demands: [],
      documents: [],
      stats: {}
    };
  }
};

export const updateDashboard = async (id, data) => {
  // No endpoint for this yet, maybe update profile?
  console.warn("Update dashboard not implemented on backend");
  return data;
};
