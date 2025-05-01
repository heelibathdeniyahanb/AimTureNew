import React from 'react'
import UserProfile from '../../Components/User/UserProfile'
import SideBar from '../../Components/User/SideBar';
import Header from '../../Components/User/Header';

export default function UserProfilePage() {
  return (
    <div >
     <div className="min-h-screen bg-[#1e1e1e] flex">
      <SideBar />
      <div className="flex-grow">
        <Header />
        <UserProfile/></div></div></div>

  );
};
