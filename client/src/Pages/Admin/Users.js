// AllUsersPage.jsx
import React, { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser, addUser } from "../../Components/Apis/UserApi";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import Header from "../../Components/User/Header";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import UserFormModal from "../../Components/Admin/UserFormModal";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userFormData, setUserFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");


  const fetchUsers = async () => {
    try {
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      toast.error("Error loading users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddClick = () => {
    setUserFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNo: "",
      role: "",
      gender: "",
      dateOfBirth: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUserFormData(user);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const dob = new Date(userFormData.dateOfBirth);
    const today = new Date();

    if (!userFormData.firstName || !userFormData.lastName) {
      toast.error("First and last name required");
      return;
    }
    if (!emailRegex.test(userFormData.email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!phoneRegex.test(userFormData.mobileNo)) {
      toast.error("Phone must be 10 digits");
      return;
    }
    if (!userFormData.role) {
      toast.error("Role is required");
      return;
    }
    if (dob >= today) {
      toast.error("Date of birth must be in the past");
      return;
    }

    try {
      if (isEditMode && selectedUser) {
        await updateUser(selectedUser.id, userFormData);
        toast.success("User updated");
      } else {
        await addUser(userFormData);
        toast.success("User added");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
       toast.error("Error: " + (error.response?.data || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted");
        fetchUsers();
      } catch {
        toast.error("Failed to delete");
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  return (
   <div className="min-h-screen bg-[#1e1e1e] flex text-white">
       <div className="fixed top-0 left-0 h-full w-[250px] bg-[#1e1e1e] z-10">
        <AdminSidebar />
      </div>
      <div className="flex-grow ml-[254px] p-6">
        <Header />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Users</h1>
          <button
            className="flex items-center gap-2 bg-[#56B2BB] text-white px-4 py-2 rounded"
            onClick={handleAddClick}
          >
            <FaPlus /> Add User
          </button>
        </div>
 <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or role"
            className="w-full px-4 py-2 border border-gray-500 rounded text-black"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-600">
            <thead className="bg-[#292929]">
              <tr>
                <th className="px-4 py-2 border border-gray-700">#</th>
                <th className="px-4 py-2 border border-gray-700">Name</th>
                <th className="px-4 py-2 border border-gray-700">Email</th>
                <th className="px-4 py-2 border border-gray-700">Role</th>
                <th className="px-4 py-2 border border-gray-700">DOB</th>
                <th className="px-4 py-2 border border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} className="hover:bg-[#2d2d2d]">
                  <td className="px-4 py-2 border border-gray-700">{idx + 1}</td>
                  <td className="px-4 py-2 border border-gray-700">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">{user.email}</td>
                  <td className="px-4 py-2 border border-gray-700">{user.role}</td>
                  <td className="px-4 py-2 border border-gray-700">{user.dateOfBirth?.slice(0, 10)}</td>
                  <td className="px-4 py-2 border border-gray-700">
                    <button onClick={() => handleEditClick(user)} className="mr-2 text-yellow-400">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          userData={userFormData}
          setUserData={setUserFormData}
          isEdit={isEditMode}
        />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AllUsersPage;
