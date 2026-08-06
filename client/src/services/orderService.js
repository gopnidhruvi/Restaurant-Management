import api from "../api/axios";

// Get All Orders
export const getOrders = async () => {
  const res = await api.get("/api/orders");
  return res.data;
};

// Get Order By Id
export const getOrderById = async (id) => {
  const res = await api.get(`/api/orders/${id}`);
  return res.data;
};

// Create Order
export const createOrder = async (data) => {
  const res = await api.post("/api/orders", data);
  return res.data;
};

// Add Items To Existing Order
export const addItemsToOrder = async (id, data) => {
  const res = await api.patch(`/api/orders/${id}/items`, data);
  return res.data;
};

// Change Order Status
export const changeOrderStatus = async (id, data) => {
  const res = await api.put(`/api/orders/status/${id}`, data);
  return res.data;
};

// Change Payment Status
export const changePaymentStatus = async (id, data) => {
  const res = await api.put(`/api/orders/payment/${id}`, data);
  return res.data;
};

// Delete Order
export const deleteOrder = async (id) => {
  const res = await api.delete(`/api/orders/${id}`);
  return res.data;
};

// Restore Order
export const restoreOrder = async (id) => {
  const res = await api.patch(`/api/orders/restore/${id}`);
  return res.data;
};

// Get Orders By Table
export const getOrdersByTable = async (tableId) => {
  const res = await api.get(`/api/orders/table/${tableId}`);
  return res.data;
};

// Get Pending Orders
export const getPendingOrders = async () => {
  const res = await api.get("/api/orders/pending");
  return res.data;
};

// Get Completed Orders
export const getCompletedOrders = async () => {
  const res = await api.get("/api/orders/completed");
  return res.data;
};