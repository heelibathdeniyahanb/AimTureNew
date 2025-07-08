import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchAdvertisements } from "../Apis/AdvertisementsApi";

const MarketingManagerDashboard = () => {
  const navigate = useNavigate();
  const [advertisementCount, setAdvertisementCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [graphData, setGraphData] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    // TODO: Replace with actual API calls
    const getAds = async () => {
      const ads = await fetchAdvertisements();
      setAdvertisementCount(ads.length);}
    setTotalIncome(120000);
    setGraphData([
      { month: "Jan", income: 15000 },
      { month: "Feb", income: 20000 },
      { month: "Mar", income: 25000 },
      { month: "Apr", income: 18000 },
      { month: "May", income: 22000 },
    ]);
    getAds();
  }, []);

  return (
    <div className="p-6 bg-[#1e1e1e] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        
       
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#292929] p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold text-[#f0f6f4]">Total Advertisements</h3>
          <p className="text-4xl font-bold text-[#56B2BB] mt-2">{advertisementCount}</p>
        </div>

        <div className="bg-[#292929] p-6 rounded-xl shadow-md text-center">
          <h3 className="text-xl font-semibold text-[#f0f6f4]">Total Income</h3>
          <p className="text-4xl font-bold text-[#56B2BB] mt-2">Rs. {totalIncome.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#292929] p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-[#f0f6f4] mb-4">Monthly Income Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#56b2bb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketingManagerDashboard;
