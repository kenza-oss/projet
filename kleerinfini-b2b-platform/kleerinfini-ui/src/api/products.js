import axios from "./axios";

// Get product by ID
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`products/${id}/`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch product", err);
    return null;
  }
};

// List all products
export const getProducts = async () => {
  try {
    const res = await axios.get("products/");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch products", err);
    return [];
  }
};

// Get all products by a specific producer (default to current session)
export const getProductsByProducer = async (producerId = 'me') => {
  try {
    const res = await axios.get(`products/?producer=${producerId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch products for producer", err);
    return [];
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const res = await axios.post("products/", productData);
    return res.data;
  } catch (err) {
    console.error("Failed to create product", err);
    throw err; // Propagate error to caller
  }
};

// Update a product
export const updateProduct = async (id, productData) => {
  try {
    const res = await axios.put(`products/${id}/`, productData);
    return res.data;
  } catch (err) {
    console.error("Failed to update product", err);
    throw err; // Propagate error to caller
  }
};

// Partial update
export const patchProduct = async (id, productData) => {
  try {
    const res = await axios.patch(`products/${id}/`, productData);
    return res.data;
  } catch (err) {
    console.error("Failed to patch product", err);
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`products/${id}/`);
    return true;
  } catch (err) {
    console.error("Failed to delete product", err);
    return false;
  }
};
