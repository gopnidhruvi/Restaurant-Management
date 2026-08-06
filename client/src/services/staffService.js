import api from "../api/axios";

// Create Staff
export const createStaff = async (data) => {
  const res = await api.post("/api/staff", data);
  return res.data;
};

// Get All Staff
export const getStaff = async () => {
  const res = await api.get("/api/staff");
  return res.data;
};

// Get Staff By Id
export const getStaffById = async (id) => {
  const res = await api.get(`/api/staff/${id}`);
  return res.data;
};

// Get Staff By Restaurant
export const getStaffByRestaurant = async (restaurantId) => {
  const res = await api.get(`/api/staff/restaurant/${restaurantId}`);
  return res.data;
};

// Update Staff
export const updateStaff = async (id, data) => {
  const res = await api.put(`/api/staff/${id}`, data);
  return res.data;
};

// Change Staff Status
export const changeStaffStatus = async (id, status) => {
  const res = await api.patch(`/api/staff/${id}/status`, {
    status,
  });
  return res.data;
};

// Delete Staff (Soft Delete)
export const deleteStaff = async (id) => {
  const res = await api.delete(`/api/staff/${id}`);
  return res.data;
};

// Restore Staff


export const restoreStaff = async (id) => {
  const res = await api.patch(`/api/staff/${id}/restore`);
  return res.data;
};