// src/components/Admin/UserFormModal.jsx
import React from "react";

const UserFormModal = ({ isOpen, onClose, onSubmit, userData, setUserData, isEdit }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1e1e1e] text-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-2xl mb-4">{isEdit ? "Edit User" : "Add User"}</h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="firstName"
            placeholder="First Name"
            value={userData.firstName || ""}
            onChange={handleChange}
            className="bg-[#2f2f2f] p-2 rounded text-white"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={userData.lastName || ""}
            onChange={handleChange}
            className="bg-[#2f2f2f] p-2 rounded text-white"
          />
          <input
            name="email"
            placeholder="Email"
            value={userData.email || ""}
            onChange={handleChange}
            className="bg-[#2f2f2f] p-2 rounded text-white"
          />
          <input
            name="mobileNo"
            placeholder="Mobile Number"
            value={userData.mobileNo || ""}
            onChange={handleChange}
            className="bg-[#2f2f2f] p-2 rounded text-white"
          />
          {/* Role Dropdown */}
          <select
            name="role"
            value={userData.role || ""}
            onChange={handleChange}
            className="bg-[#2f2f2f] p-2 rounded text-white"
            disabled={isEdit} // 🛑 disable when editing
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Marketing manager">Marketing manager</option>
          </select>

          <select
            name="gender"
            value={userData.gender || ""}
            onChange={handleChange}
            className="bg-[#2f2f2f] p-2 rounded text-white"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            name="dateOfBirth"
            type="date"
            value={userData.dateOfBirth || ""}
            onChange={handleChange}
            className="bg-[#2f2f2f] p-2 rounded text-white"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded bg-[#56B2BB] hover:bg-[#3a9ba7]"
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
