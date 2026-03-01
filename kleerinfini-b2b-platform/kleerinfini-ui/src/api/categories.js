import api from "./axios";

// List all categories
export const getCategories = async () => {
  const { data } = await api.get("categories/");
  return data;
};

// Create new category
export const createCategory = async (category) => {
  const { data } = await api.post("categories/", category);
  return data;
};

// Read single category
export const getCategory = async (id) => {
  const { data } = await api.get(`categories/${id}/`);
  return data;
};

// Update category
export const updateCategory = async (id, category) => {
  const { data } = await api.put(`categories/${id}/`, category);
  return data;
};

// Delete category
export const deleteCategory = async (id) => {
  const { data } = await api.delete(`categories/${id}/`);
  return data;
};
