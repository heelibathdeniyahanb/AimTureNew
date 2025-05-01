import { useNavigate } from "react-router-dom";

const MarketingDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome to the Marketing Dashboard!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MarketingDashboard;
