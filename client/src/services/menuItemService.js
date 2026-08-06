import api from "../api/axios";

// Create Menu Item
export const createMenuItem = async (data) => {
  const res = await api.post("/api/menu-items", data);
  return res.data;
};

// Get All Menu Items
export const getMenuItems = async () => {
  const res = await api.get("/api/menu-items");
  return res.data;
};

// Get Menu Item By Id
export const getMenuItemById = async (id) => {
  const res = await api.get(`/api/menu-items/${id}`);
  return res.data;
};

// Update Menu Item
export const updateMenuItem = async (id, data) => {
  const res = await api.put(`/api/menu-items/${id}`, data);
  return res.data;   // IMPORTANT
};

// Delete Menu Item
export const deleteMenuItem = async (id) => {
  const res = await api.delete(`/api/menu-items/${id}`);
  return res.data;
};

// Restore Menu Item
export const restoreMenuItem = async (id) => {
  const res = await api.patch(`/api/menu-items/${id}/restore`);
  return res.data;
};

// Change Status
export const changeMenuItemStatus = async (id, status) => {
  const res = await api.patch(`/api/menu-items/${id}/status`, { status });
  return res.data;
};

// Get Menu Items By Category
export const getMenuItemsByCategory = async (categoryId) => {
  const res = await api.get(`/api/menu-items/category/${categoryId}`);
  return res.data;
};

// Get Menu Items By Restaurant
export const getMenuItemsByRestaurant = async (restaurantId) => {
  const res = await api.get(`/api/menu-items/restaurant/${restaurantId}`);
  return res.data;
};
