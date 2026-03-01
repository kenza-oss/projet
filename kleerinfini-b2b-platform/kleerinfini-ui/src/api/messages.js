import api from "./axios";

// 🔹 Get all messages or create a new message
export const getMessages = async () => {
  const { data } = await api.get("messages/");
  return data;
};

export const createMessage = async (messageData) => {
  const { data } = await api.post("messages/", messageData);
  return data;
};

// 🔹 Get messages by receiver (UUID)
export const getMessagesByReceiver = async (receiverId) => {
  const { data } = await api.get(`messages/${receiverId}/`);
  return data;
};

// 🔹 Mark a message as read
export const markMessageAsRead = async (messageId) => {
  const { data } = await api.post("mark-as-read/", { id: messageId });
  return data;
};
