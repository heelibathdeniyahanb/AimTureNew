import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import { useContext,useEffect } from "react";
import { UserContext } from "../../Components/UserContext";
import Header from "../../Components/User/Header";

const AdminDashboardPage = () => {
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
       <AdminSidebar/>
        <div className="flex-grow">
          <Header />
        
          {/* Add dashboard content here */}
        </div>
      </div>
    );
};

export default AdminDashboardPage;

