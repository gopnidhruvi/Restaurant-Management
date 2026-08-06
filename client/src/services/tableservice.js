import api from "../api/axios";
    
// CREATE TABLE
export const createTable = async (data) => {
    const res = await api.post("/api/tables", data);
    return res.data;
};

// GET ALL TABLES
export const getAllTables = async () => {
    const res = await api.get("/api/tables");
    return res.data;
};

//  GET SINGLE TABLEs
export const getTableById = async (id) => {
    const res = await api.get(`/api/tables/${id}`);
    return res.data;
};


// UPDATE TABLE
export const updateTable = async (id, data) => {
    const res = await api.put(`/api/tables/${id}`, data);
    return res.data;
};

// DELETE TABLE (soft delete)
export const deleteTable = async (id) => {
    const res = await api.delete(`/api/tables/${id}`);
    return res.data;
};

// RESTORE TABLE
export const restoreTable = async (id) => {
    const res = await api.patch(`/api/tables/${id}/restore`);
    return res.data;
};

// UPDATE TABLE STATUS
export const updateTableStatus = async (id, status) => {
    const res = await api.patch(`/api/tables/${id}/status`, {
        status,
    });
    return res.data;
};