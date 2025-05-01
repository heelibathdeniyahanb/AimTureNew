import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext({});

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user state from local storage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  useEffect(() => {
    // Fetch the profile data only if the user is not already set from local storage
    if (!user) {
      axios.get('https://localhost:7295/api/Auth/get-current-user')
        .then(({ data }) => {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch(err => console.log(err));
    }
  }, [user]);



  const logout = () => {
    // Optionally, notify the backend to invalidate the session/token
    axios.post('https://localhost:7295/api/Auth/logout')
      .then(() => {
        // Clear user state
        setUser(null);
        // Remove user from local storage
        localStorage.removeItem('user');
      })
      .catch(err => console.log(err));
  };

  return (
    <UserContext.Provider value={{ user, setUser,  logout }}>
      {children}
    </UserContext.Provider>
  );
}
