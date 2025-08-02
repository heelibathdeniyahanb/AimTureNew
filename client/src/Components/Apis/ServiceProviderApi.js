import axios from 'axios';
import { API_BASE_URL } from './BaseUrl';

const API = `${API_BASE_URL }/AdvertisemntProvider`;

export const AdvertisementProviderAPI = {
  // Get all providers
  getAll: async () => {
    try {
      const response = await axios.get(API);
      return response.data;
    } catch (error) {
      console.error("Error fetching advertisement providers:", error);
      throw error;
    }
  },

  // Get provider by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching provider with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new provider
  create: async (providerData) => {
    try {
      const response = await axios.post(API, providerData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating advertisement provider:", error);
      throw error;
    }
  },

  // Delete provider by ID
  delete: async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting provider with ID ${id}:`, error);
      throw error;
    }
  },
};
