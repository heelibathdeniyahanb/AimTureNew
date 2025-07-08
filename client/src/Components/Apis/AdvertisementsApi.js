// api.js
export const fetchAdvertisements = async () => {
    try {
      const response = await fetch('https://localhost:7295/api/Advertisement');
      if (!response.ok) {
        throw new Error('Failed to fetch advertisements');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      // Return demo data in case of failure
     
    }
  };

  export const fetchPagedAdvertisements = async (page = 1, pageSize = 6, search = "") => {
  try {
    const res = await fetch(
      `https://localhost:7295/api/Advertisement/paged?search=${search}&page=${page}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};


  
  export const createAdvertisement = async (formData) => {
  try {
    const response = await fetch('https://localhost:7295/api/Advertisement', {
      method: 'POST',
      body: formData, // FormData should be passed from the component
    });

    if (!response.ok) throw new Error('Failed to create advertisement');

    return await response.json();
  } catch (error) {
    console.error('Error creating advertisement:', error);
    return null;
  }
};

export const updateAdvertisement = async (id, formData) => {
  try {
    const response = await fetch(`https://localhost:7295/api/Advertisement/${id}`, {
      method: 'PUT',
      body: formData,
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating advertisement:', error);
    return false;
  }
};

export const deleteAdvertisement = async (id) => {
  try {
    const response = await fetch(`https://localhost:7295/api/Advertisement/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    return false;
  }
};
