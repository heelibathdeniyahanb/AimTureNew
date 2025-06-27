import React from 'react'
import UserProfile from '../../Components/User/UserProfile'
import SideBar from '../../Components/User/SideBar';
import Header from '../../Components/User/Header';
import AdminSidebar from '../../Components/Admin/AdminSidebar';

export default function AdminProfile() {
  return (
    <div >
     <div className="min-h-screen bg-[#1e1e1e] flex">
      <AdminSidebar/>
      <div className="flex-grow">
        <Header />
        <UserProfile/></div></div></div>

  );
};
