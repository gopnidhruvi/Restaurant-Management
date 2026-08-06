import api from "../api/axios";

// Create Category
export const createCategory = async (data) => {
  const res = await api.post("/api/categories", data);
  return res.data;
};

// Get All Categories
export const getCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data;
};

// Get Category By Id
export const getCategoryById = async (id) => {
  const res = await api.get(`/api/categories/${id}`);
  return res.data;
};

// Update Category
export const updateCategory = async (id, data) => {
  const res = await api.put(`/api/categories/${id}`, data, );
  return res.data;
};

// Delete Category
export const deleteCategory = async (id) => {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
};

// Restore Category
export const restoreCategory = async (id) => {
  const res = await api.patch(`/api/categories/${id}/restore`);
  return res.data;
};


export const toggleCategoryVisibility = async (id, status) => {
  const res = await api.patch(`/api/categories/${id}/status`, {
    status,
  });

  return res.data;
};
