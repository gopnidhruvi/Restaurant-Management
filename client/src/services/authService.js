import api from "../api/axios";

export const login = async (data) => {
    const res = await api.post("/api/users/login", data);
    return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/api/users/me");
  return res.data;
};