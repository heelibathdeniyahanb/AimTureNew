// src/api/userApi.js
import {API_BASE_URL} from '../Apis/BaseUrl'
import axios from 'axios';

export const addUser = async (user) => {
  return axios.post(`${API_BASE_URL}/Auth/register`, user);
};


export async function updateUser(userId, updatedUser) {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/update-user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      const updatedData = await response.json();
      return updatedData;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  export const sendResetCode = (email) => {
  return axios.post(`${API_BASE_URL}/Auth/forgot-password`, { email });
};

export const verifyResetCode = (email, code) => {
  return axios.post(`${API_BASE_URL}/Auth/verify-reset-code`, { email, code });
};

export const resetPassword = (email, code, newPassword) => {
  return axios.post(`${API_BASE_URL}/Auth/reset-password`, {
    email,
    code,
    newPassword,
  });
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Auth/get-all-users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  return axios.delete(`${API_BASE_URL}/Auth/delete-user/${userId}`);
};

