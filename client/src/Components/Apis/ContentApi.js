import axios from "axios";

const API_URL = "https://localhost:7295/api/Content"; // adjust to your backend URL

// ✅ Get all contents
export const getAllContents = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ✅ Get content by ID
export const getContentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// ✅ Create new content (with file upload)
export const createContent = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ✅ Update content
export const updateContent = async (id, content) => {
  const response = await axios.put(`${API_URL}/${id}`, content);
  return response.data;
};

// ✅ Delete content
export const deleteContent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.status === 204;
};

// ✅ Approve content
export const approveContent = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/approve`);
  return response.data;
};
