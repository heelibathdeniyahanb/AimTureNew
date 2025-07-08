import React ,{useContext}from 'react';
import logo from '../../Images/aimture long.png';
import { IoIosNotifications } from "react-icons/io";
import { UserContext } from '../UserContext';

export default function Header() {
  const context = useContext(UserContext);
  //console.log(user.firstName)
  if (!context) {
    return null; // Return null or a fallback if context is not available
  }

  const { user, logout } = context;

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : "G";

  return (<>
     <div className="flex items-center justify-between px-8 py-4 bg-[#1e1e1e] font-nunito">
        {/* Left section */}
        <div className="flex items-center space-x-6">
          <IoIosNotifications className="text-[#d9d9d9] text-2xl cursor-pointer" />
          <h1 className="text-2xl font-bold text-[#d9d9d9] mb-2">
            Welcome back,&nbsp;
            {user ? `${user.firstName} ${user.lastName} !` : "Guest"}
          </h1>
        </div>

        {/* Right section: Avatar */}
        <div className="relative group">
          <div className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-lg cursor-pointer">
            {initials}
          </div>
          {user && (
            <div className="absolute right-0 mt-2 w-max px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              {user.email}
            </div>
          )}
        </div>
      </div>

      {/* Optional horizontal line */}
      <hr className="border-t border-gray-700" />
    </>
  );
}
