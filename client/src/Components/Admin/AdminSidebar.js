import React, { useContext } from 'react';
import { FaTachometerAlt, FaUser, FaBook, FaCog, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../../Images/aimture long.png';
import { UserContext } from '../UserContext'; // Make sure the correct path to UserContext is used
import { FaUsers } from 'react-icons/fa6';

const AdminSidebar = () => {
   // Access user data and logout function from context
  const navigate = useNavigate();
  const location = useLocation();
   const context = useContext(UserContext);
    //console.log(user.firstName)
    if (!context) {
      return null; // Return null or a fallback if context is not available
    }
  
    const { user, logout } = context;

  const menuItems = [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/admin/dashboard/page' },
    { name: 'My Profile', icon: FaUser, path: '/user/profile' },
    { name: 'Users', icon: FaUsers, path: '/users' },
    { name: 'Email', icon: FaEnvelope, path: '/email' },
    { name: 'Settings', icon: FaCog, path: '/user-settings' },
  ];

  const activeItem = menuItems.find((item) => item.path === location.pathname)?.name || 'Dashboard';

  const handleLogout = async () => {
    try {
      const response = await fetch('https://localhost:7295/api/Auth/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are included in the request
      });
  
      if (response.ok) {
        // Navigate to the login page after successful logout
        navigate('/login');
      } else {
        console.error('Failed to logout:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while logging out:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 text-[#F0F4F8] flex flex-col">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-40 h-10" />
      </div>

      <div className="border border-gray-700 border-opacity-10 rounded-lg p-4 mt-10 flex flex-col h-full">
        <div className="flex-grow">
          <ul className="space-y-5">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`flex items-center space-x-3 p-2 rounded-md 
                  ${activeItem === item.name ? 'bg-gray-700' : 'hover:bg-gray-700'} 
                  cursor-pointer`}
              >
                <Link to={item.path} className="flex items-center space-x-3 w-full">
                  <item.icon className="text-gray-400" />
                  <span className="text-gray-300 hover:text-white">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-5 border-t border-gray-700 border-opacity-10">
         
          
          <ul>
            <li
              className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md cursor-pointer"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-gray-400" />
              <span className="text-gray-300 hover:text-white">Log Out</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
