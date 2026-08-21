import api from "../api/axios";

export const addDisplayVideo = async (formData) => {
    const res = await api.post("/api/display-videos/videos",formData);
    return res.data;
};

export const getDisplayVideos = async () => {
    const res = await api.get("/api/display-videos/videos");
    return res.data;
};