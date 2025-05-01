import React, { useContext, useState } from 'react';
import { FaTachometerAlt, FaUser, FaBook, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../../Images/aimture long.png';
import { UserContext } from '../UserContext';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!context) return null;

  const { user, logout } = context;

  const menuItems = [
    { name: 'Dashboard', icon: FaTachometerAlt, path: '/user/dashboard' },
    { name: 'My Profile', icon: FaUser, path: '/user/profile' },
    { name: 'My Learning Paths', icon: FaBook, path: '/learning/path' },
    { name: 'Settings', icon: FaCog, path: '/user-settings' },
  ];

  const activeItem = menuItems.find((item) => item.path === location.pathname)?.name || 'Dashboard';

  const handleLogout = async () => {
    try {
      const response = await fetch('https://localhost:7295/api/Auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Failed to logout:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while logging out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-[#18181b] text-gray-300 p-4 md:hidden shadow-md">
        <img src={logo} alt="Logo" className="w-32 object-contain" />
        <button onClick={toggleSidebar} className="text-2xl focus:outline-none">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-[#18181b] text-gray-300 flex flex-col shadow-lg font-poppins text-sm font-semibold 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:flex md:min-h-screen w-64 z-50
      `}>
        {/* Logo */}
        <div className="flex items-center mb-8 p-6">
          <img src={logo} alt="Logo" className="w-44 h-12 object-contain" />
        </div>

        {/* Menu */}
        <div className="flex-1 flex flex-col justify-between px-4">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile when clicking a link
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    ${activeItem === item.name ? 'bg-[#256d85] text-white' : 'hover:bg-[#262626] hover:text-white'}
                  `}
                >
                  <item.icon className="text-lg" />
                  <span className="text-md font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout */}
          <div className="pt-8 border-t border-gray-700 mt-8">
            <button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 w-full hover:bg-[#262626] hover:text-white"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="text-md font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-40 z-40 md:hidden" onClick={toggleSidebar}></div>}
    </>
  );
};

export default SideBar;
