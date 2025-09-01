// AdminDashboardPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../Components/Apis/UserApi";
import { getAllLearningPaths } from "../../Components/Apis/LearningPathApi";
import { getAllContents, approveContent } from "../../Components/Apis/ContentApi"; 
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import Header from "../../Components/User/Header";
import { UserContext } from "../../Components/UserContext";
import ContentPreview from "../../Components/Common/ContentPreview";
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
  const [pendingContents, setPendingContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null); // ✅ for modal

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function loadDashboardData() {
      try {
        const users = await getAllUsers();
        const paths = await getAllLearningPaths();
        const contents = await getAllContents();

        setUserCount(users.length);
        setLearningPathCount(paths.length);

        // Pending contents
        const unapproved = contents.filter((c) => !c.isApprove);
        setPendingContents(unapproved);

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

  const handleApprove = async (id) => {
    try {
      await approveContent(id);
      setPendingContents((prev) => prev.filter((c) => c.id !== id));
      setSelectedContent(null); // close modal after approve
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex text-white">
      <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
        <AdminSidebar />
      </div>
      <div className="flex-grow ml-[260px] p-6">
        <Header />
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats */}
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

        {/* Chart */}
        <div className="bg-[#292929] p-6 rounded-xl shadow-md mb-10">
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

        {/* Pending Approvals */}
        <div className="bg-[#292929] p-6 rounded-xl shadow-md">
          <h2 className="text-xl mb-4">Pending Content Approvals</h2>
          {pendingContents.length === 0 ? (
            <p className="text-gray-400">No pending content for approval 🎉</p>
          ) : (
            <div className="space-y-4">
              {pendingContents.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between bg-[#1e1e1e] p-4 rounded-lg cursor-pointer hover:bg-[#333]"
                  onClick={() => setSelectedContent(content)} // ✅ open modal
                >
                  <div>
                    <h3 className="font-semibold text-[#56B2BB]">{content.title}</h3>
                    <p className="text-sm text-gray-400">{content.description || "No description"}</p>
                  </div>
                  <span className="text-sm text-gray-500">Click to view</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedContent && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
    <div className="bg-[#292929] p-6 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-xl">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-white"
        onClick={() => setSelectedContent(null)}
      >
        ✖
      </button>

      <h2 className="text-2xl font-bold mb-4 text-[#56B2BB]">{selectedContent.title}</h2>
      <p className="mb-2"><span className="font-semibold">Category:</span> {selectedContent.specializationNames?.join(", ") || "N/A"}</p>
      <p className="mb-2"><span className="font-semibold">Submitted By:</span> {selectedContent.contributorName || "Unknown"}</p>
      <p className="mb-4">{selectedContent.description}</p>

      {/* Render content preview (images, videos, PDFs, documents) */}
       {/* Reuse ContentPreview */}
      <div className="bg-[#1e1e1e] rounded-lg p-4 mb-4">
        <ContentPreview content={selectedContent} />
      </div>

      {/* Admin action */}
      {!selectedContent.isApprove && (
        <button
          onClick={() => handleApprove(selectedContent.id)}
          className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white font-semibold transition"
        >
          Approve
        </button>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default AdminDashboardPage;
