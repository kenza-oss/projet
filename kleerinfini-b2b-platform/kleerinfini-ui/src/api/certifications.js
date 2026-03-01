import api from "./axios";

// List all certifications
export const getCertifications = async () => {
  const { data } = await api.get("certifications/");
  return data;
};

// Create new certification
export const createCertification = async (certification) => {
  const { data } = await api.post("certifications/", certification);
  return data;
};

// Read single certification
export const getCertification = async (id) => {
  const { data } = await api.get(`certifications/${id}/`);
  return data;
};

// Update certification
export const updateCertification = async (id, certification) => {
  const { data } = await api.put(`certifications/${id}/`, certification);
  return data;
};

// Delete certification
export const deleteCertification = async (id) => {
  const { data } = await api.delete(`certifications/${id}/`);
  return data;
};
