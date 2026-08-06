import api from "../api/axios";

// Add Customer
export const addToWaiting = async (data) => {
  const res = await api.post("/api/waiting", data);
  return res.data;
};

// Get Waiting List
export const getWaitingList = async (params = {}) => {
  const res = await api.get("/api/waiting", { params });
  return res.data;
};

// Get Waiting Entry By Id
export const getWaitingEntryById = async (id) => {
  const res = await api.get(`/api/waiting/${id}`);
  return res.data;
};

// Seat Customer
export const seatCustomer = async (id, data) => {
  const res = await api.patch(`/api/waiting/${id}/seat`, data);
  return res.data;
};

// Update Waiting Status
export const updateWaitingStatus = async (id, data) => {
  const res = await api.patch(`/api/waiting/${id}/status`, data);
  return res.data;
};

// Update Wait Time
export const updateWaitTime = async (id, data) => {
  const res = await api.patch(`/api/waiting/${id}/wait-time`, data);
  return res.data;
};

// Delete Waiting Entry
export const deleteWaitingEntry = async (id) => {
  const res = await api.delete(`/api/waiting/${id}`);
  return res.data;
};

