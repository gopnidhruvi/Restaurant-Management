import api from "../api/axios";

export const getOwners = async () => {
  const res = await api.get("/api/owners");
  return res.data;
};

export const getOwnerById = async (id) => {
  const res = await api.get(`/api/owners/${id}`);
  return res.data;
};

export const createOwner = async (data) => {
  const res = await api.post("/api/owners", data);
  return res.data;
};

export const updateOwner = async (id, data) => {
  const res = await api.put(`/api/owners/${id}`, data);
  return res.data;
};

export const deleteOwner = async (id) => {
  const res = await api.delete(`/api/owners/${id}`);
  return res.data;
};

export const recoverOwner = async (id) => {
  const res = await api.patch(`/api/owners/${id}/restore`);
  return res.data;
};

export const toggleOwnerVisibility = async (id) => {
  const res = await api.patch(`/api/owners/${id}/status`);
  return res.data;
};

