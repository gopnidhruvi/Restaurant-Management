import api from "../api/axios";


export const getRestaurants = async () => {
  const res = await api.get("/api/restaurants");
  return res.data;
};

export const getRestaurantById = async (id) => {
  const res = await api.get(`/api/restaurants/${id}`);
  return res.data;
};

export const createRestaurant = async (data) => {
  const res = await api.post("/api/restaurants", data);
  return res.data;
};

export const updateRestaurant = async (id, data) => {
  const res = await api.put(`/api/restaurants/${id}`, data);
  return res.data;
};

export const deleteRestaurant = async (id) => {
  const res = await api.delete(`/api/restaurants/${id}`);
  return res.data;
};

export const toggleVisibility = async (id) => {
  const res = await api.patch(`/api/restaurants/${id}/status`);
  return res.data;
};

export const recoverRestaurant = async (id) => {
  const res = await api.patch(`/api/restaurants/${id}/recover`);
  return res.data;
};




