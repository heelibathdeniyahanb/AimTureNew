// src/api/userApi.js

export async function updateUser(userId, updatedUser) {
    try {
      const response = await fetch(`https://localhost:7295/api/Auth/update-user/${userId}`, {
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
  