import api from "./axios";

// Upload a proof/document
export const uploadProof = async (formData) => {
  const { data } = await api.post("/api/upload-proof/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
