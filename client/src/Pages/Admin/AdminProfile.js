import React from 'react'
import UserProfile from '../../Components/User/UserProfile'
import SideBar from '../../Components/User/SideBar';
import Header from '../../Components/User/Header';
import AdminSidebar from '../../Components/Admin/AdminSidebar';

export default function AdminProfile() {
  return (
    <div >
     <div className="min-h-screen bg-[#1e1e1e] flex text-white">
       <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
        <AdminSidebar />
      </div>
      <div className="flex-grow ml-[260px]">
        <Header />
        <UserProfile/></div></div></div>

  );
};
