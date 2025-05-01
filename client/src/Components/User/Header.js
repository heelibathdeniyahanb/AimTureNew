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

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-[#1e1e1e] font-nunito">
      
      <div className="flex items-center space-x-6">
        <IoIosNotifications className="text-[#d9d9d9] text-2xl cursor-pointer" />
        <span className="text-[#d9d9d9] font-medium">
        {user ? `${user.firstName} ${user.lastName}, ${user.email}` : "Guest"}
</span>

      </div>
    </div>
  );
}
