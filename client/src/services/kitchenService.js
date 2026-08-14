import api from "../api/axios";

// Get all kitchen orders
export const getKitchenOrders = async () => {
  const res = await api.get("/api/kitchen/orders");
  return res.data;
};

// Get kitchen order by ID
export const getKitchenOrderById = async (id) => {
  const res = await api.get(`/api/kitchen/${id}`);
  return res.data;
};

// Pending -> Preparing
export const acceptKitchenOrder = async (id) => {
  const res = await api.put(`/api/kitchen/accept/${id}`);
  return res.data;
};

// Preparing -> Ready
export const readyKitchenOrder = async (id) => {
  const res = await api.put(`/api/kitchen/ready/${id}`);
  return res.data;
};
  
// Ready -> Served
export const servedKitchenOrder = async (id) => {
  const res = await api.put(`/api/kitchen/served/${id}`);
  return res.data;
};