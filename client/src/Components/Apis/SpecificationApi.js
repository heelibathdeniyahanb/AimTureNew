import axios from "axios";

const API_URL = "https://localhost:7295/api/Specification"; // Adjust if different

export const SpecificationAPI = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  create: async (name) => {
    const res = await axios.post(API_URL, { name });
    return res.data;
  },
};
