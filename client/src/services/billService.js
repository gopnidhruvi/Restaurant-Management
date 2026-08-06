import api from "../api/axios";


// Generate Bill
export const generateBill = async (data) => {
  const response = await api.post("/api/bills", data);
  return response.data;
};

export const confirmPayment = async (id, data) => {
  const response = await api.patch(`/api/bills/${id}/pay`, data);
  return response.data;
};
// Get All Bills
export const getBills = async (params) => {
  const response = await api.get("/api/bills", {
    params,
  });
  return response.data;
};

// Get Bill By ID
export const getBillById = async (id) => {
  const response = await api.get(`/api/bills/${id}`);
  return response.data;
};

// Get KOT
export const getKOT = async (orderId) => {
  const response = await api.get(`/api/bills/kot/${orderId}`);
  return response.data;
};

// Delete Bill (If API exists)
// export const deleteBill = async (id) => {
//   const response = await api.delete(`/api/bills/${id}`);
//   return response.data;
// };

// Refund Bill (If API exists)
// export const refundBill = async (id) => {
//   const response = await api.patch(`/api/bills/${id}/refund`);
//   return response.data;
// };