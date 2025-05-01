import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { updateUser } from '../Apis/UserApi';

export default function UserProfile() {
  const context = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(context?.user || {});

  if (!context) return null;
  const { user, setUser } = context;

  const handleEditClick = () => {
    setUpdatedUser({ ...user });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = await updateUser(user.id, updatedUser);
      setUser(updatedData);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-10 py-12 min-h-screen bg-[#19191A] text-[#f0f4f8]">
  <div className="w-full max-w-5xl p-12 bg-[#19191A] rounded-2xl shadow-lg border border-[rgba(255,255,255,0.2)]">
    <h2 className="text-3xl font-bold mb-12 text-center text-[#56b2bb]">My Profile</h2>

    {isEditing ? (
      <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-3">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={updatedUser.firstName}
            onChange={handleChange}
            className="p-3 rounded bg-[rgba(86,177,187,0.14)] placeholder-[rgba(217,217,217,0.2)] text-[#f0f4f8] focus:ring-2 focus:ring-[#56b2bb] focus:outline-none"
            placeholder="First Name"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={updatedUser.lastName}
            onChange={handleChange}
            className="p-3 rounded bg-[rgba(86,177,187,0.14)] placeholder-[rgba(217,217,217,0.2)] text-[#f0f4f8] focus:ring-2 focus:ring-[#56b2bb] focus:outline-none"
            placeholder="Last Name"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            className="p-3 rounded bg-[rgba(86,177,187,0.14)] placeholder-[rgba(217,217,217,0.2)] text-[#f0f4f8] focus:ring-2 focus:ring-[#56b2bb] focus:outline-none"
            placeholder="Email"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={updatedUser.dateOfBirth}
            onChange={handleChange}
            className="p-3 rounded bg-[rgba(86,177,187,0.14)] text-[#f0f4f8] focus:ring-2 focus:ring-[#56b2bb] focus:outline-none"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label>Gender</label>
          <select
            name="gender"
            value={updatedUser.gender}
            onChange={handleChange}
            className="p-3 rounded bg-[rgba(86,177,187,0.14)] text-[#f0f4f8] focus:ring-2 focus:ring-[#56b2bb] focus:outline-none"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-8">
          <button
            type="submit"
            className="bg-[#56b2bb] hover:bg-[#4aa3ac] px-8 py-4 rounded-lg text-[#19191A] font-semibold transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.3)] px-8 py-4 rounded-lg text-[#f0f4f8] font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </form>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
        <p className="text-lg">👋 Hello, <span className="font-semibold">{user.firstName} {user.lastName}</span></p>
        <p>Email: <span className="text-[rgba(217,217,217,0.6)]">{user.email}</span></p>
        <p>Role: <span className="text-[rgba(217,217,217,0.6)]">{user.role} (Cannot edit)</span></p>
        <p>Date of Birth: <span className="text-[rgba(217,217,217,0.6)]">{user.dateOfBirth}</span></p>
        <p>Gender: <span className="text-[rgba(217,217,217,0.6)]">{user.gender}</span></p>

        <div className="col-span-1 md:col-span-2 flex justify-center mt-8">
          <button
            onClick={handleEditClick}
            className="bg-[#56b2bb] hover:bg-[#4aa3ac] px-8 py-4 rounded-lg text-[#19191A] font-bold transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    )}
  </div>
</div>

)};
