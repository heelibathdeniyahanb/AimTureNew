import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../../Components/User/SideBar";
import Header from "../../Components/User/Header";
import { UserContext } from "../../Components/UserContext";
import UserDashboard from "../../Components/User/UserDashboard";

export default function UserDashboardPage() {
  const context = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if context (user) is not available
    if (!context || !context.user) {
      navigate("/login");
    }
  }, [context, navigate]);

  if (!context || !context.user) {
    return null; // Optionally, show a loading spinner or placeholder
  }

  const { user, logout } = context;

  console.log(user.firstName);

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex">
      <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
        <SideBar />
      </div>

      <div className="flex-grow ml-[250px]">
        <Header />
        <UserDashboard />
      </div>

    </div>
  );
}
