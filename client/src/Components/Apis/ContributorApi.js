import axios from "axios";
import { API_BASE_URL } from "./BaseUrl";



export const getContributorById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Contributor/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contributor:", error);
    throw error;
  }
};

export const createContributor = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contributors`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating contributor:", error);
    throw error;
  }
};

export const updateContributor = async (contributorId, data) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Contributor/${contributorId}`,
      { id: contributorId, ...data } // send DTO with id
    );
    return response.data;
  } catch (error) {
    console.error("Error updating contributor:", error);
    throw error;
  }
};


export const getContributorByUserId = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/Contributor/by-user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch contributor");
  return await res.json();
};

