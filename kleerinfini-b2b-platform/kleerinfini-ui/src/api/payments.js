import api from "./axios";

// Create a Chargily payment link
export const createChargilyPayment = async (formData) => {
  const { data } = await api.post("chargily-payment/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Fetch all Chargily payments
export const getChargilyPayments = async () => {
  const { data } = await api.get("chargily-payment/");
  return data;
};

// Upload a manual payment proof
export const uploadPaymentProof = async (formData) => {
  const { data } = await api.post("upload-proof/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// Handle Chargily webhook
export const triggerChargilyWebhook = async (payload) => {
  const { data } = await api.post("chargily/webhook/", payload);
  return data;
};
