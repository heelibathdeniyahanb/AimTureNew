import React, { useState, useEffect } from "react";
import { AdvertisementProviderAPI } from "../Apis/ServiceProviderApi";
import { SpecificationAPI } from "../Apis/SpecificationApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export default function AddAdvertisementProvider({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    instituteName: "",
    specifications: []
  });
  const [specifications, setSpecifications] = useState([]);
  const [newSpec, setNewSpec] = useState("");

  useEffect(() => {
    loadSpecifications();
  }, []);

  const loadSpecifications = async () => {
    try {
      const data = await SpecificationAPI.getAll();
      setSpecifications(data);
    } catch (err) {
       toast.error("Failed to load specifications.");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle selecting multiple specs
  const handleSpecSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, (opt) => ({
      id: parseInt(opt.value),
      name: opt.text
    }));
    setFormData({ ...formData, specifications: value });
  };

  // ✅ Handle adding a new specification
  const handleAddSpec = async () => {
    if (!newSpec.trim()) return;
    try {
      const created = await SpecificationAPI.create(newSpec.trim());
      setSpecifications((prev) => [...prev, created]);
      setNewSpec("");
       toast.success("Specification added successfully!");
    } catch (err) {
     toast.error("Failed to add specification.");
    }
  };

  // ✅ Submit New Provider
  const handleSubmit = async (e) => {
  e.preventDefault();

  const providerData = {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    instituteName: formData.instituteName,
    specificationIds: formData.specifications.map((s) => s.id) // ✅ send IDs only
  };

  try {
    await AdvertisementProviderAPI.create(providerData);
     toast.success("Provider added successfully!");
    onSuccess();
    onClose();
  } catch (err) {
    console.error("Error adding provider:", err.response?.data || err);
    toast.error("Failed to add provider.");
  }
};


  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-[420px] relative border border-[#56B2BB]/40">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h2 className="text-2xl font-bold text-[#56B2BB] mb-4">Add Provider</h2>

      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">✖</button>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white" required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white" required />
        <input type="text" name="instituteName" placeholder="Institute Name" value={formData.instituteName} onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white" required />

        {/* ✅ Existing Specifications Dropdown */}
        <label className="block text-gray-300">Select Specifications</label>
        <select
          multiple
          onChange={handleSpecSelect}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
        >
          {specifications.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.name}
            </option>
          ))}
        </select>

        {/* ✅ Add New Specification */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="New Specification"
            value={newSpec}
            onChange={(e) => setNewSpec(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />
          <button type="button" onClick={handleAddSpec} className="bg-[#56B2BB] px-3 rounded hover:bg-[#4697a1]">
            ➕
          </button>
        </div>

        <button type="submit" className="w-full bg-[#56B2BB] hover:bg-[#4697a1] text-white py-2 rounded-lg shadow-md">
          ✅ Add Provider
        </button>
      </form>
    </div>
  );
}
