// AdminDashboardPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../Components/Apis/UserApi";
import { getAllLearningPaths } from "../../Components/Apis/LearningPathApi";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import Header from "../../Components/User/Header";
import { UserContext } from "../../Components/UserContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboardPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [learningPathCount, setLearningPathCount] = useState(0);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function loadDashboardData() {
      try {
        const users = await getAllUsers();
        const paths = await getAllLearningPaths();
        setUserCount(users.length);
        setLearningPathCount(paths.length);

        // Process month trend from paths
        const monthMap = {};
        paths.forEach((p) => {
          const month = new Date(p.deadline).toLocaleString("default", {
            month: "short",
          });
          monthMap[month] = (monthMap[month] || 0) + 1;
        });

        const monthData = Object.entries(monthMap).map(([month, count]) => ({
          month,
          count,
        }));

        setTrendData(monthData);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      }
    }

    loadDashboardData();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex text-white">
      <AdminSidebar />
      <div className="flex-grow p-6">
        <Header />
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#292929] p-6 rounded-xl shadow-md text-center">
            <h2 className="text-lg">Total Users</h2>
            <p className="text-3xl font-bold mt-2 text-[#56B2BB]">{userCount}</p>
          </div>

          <div className="bg-[#292929] p-6 rounded-xl shadow-md text-center">
            <h2 className="text-lg">Total Learning Paths</h2>
            <p className="text-3xl font-bold mt-2 text-[#56B2BB]">{learningPathCount}</p>
          </div>

          <div className="bg-[#292929] p-6 rounded-xl shadow-md text-center">
            <h2 className="text-lg">Generated Trends</h2>
            <p className="text-sm mt-2 text-gray-400">Monthly Path Creation</p>
          </div>
        </div>

        <div className="bg-[#292929] p-6 rounded-xl shadow-md">
          <h2 className="text-xl mb-4">Learning Path Generation Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <Line type="monotone" dataKey="count" stroke="#56B2BB" strokeWidth={3} />
              <CartesianGrid stroke="#444" strokeDasharray="5 5" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
