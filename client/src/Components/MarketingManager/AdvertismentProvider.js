import React, { useEffect, useState } from "react";
import { AdvertisementProviderAPI } from "../Apis/ServiceProviderApi";
import AddAdvertisementProvider from "./AddAdvertismentProvider";

export default function AdvertisemntProvider() {
  const [providers, setProviders] = useState([]);
  const [specFilter, setSpecFilter] = useState(""); 
  const [allSpecifications, setAllSpecifications] = useState([]);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await AdvertisementProviderAPI.getAll();
      setProviders(data);

      // Extract unique specifications for filter dropdown
      const specs = [...new Set(data.flatMap((p) => p.specifications.map((s) => s.name)))];
      setAllSpecifications(specs);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter providers by selected specification
  const filteredProviders = providers.filter((provider) =>
    specFilter === "" 
      ? true 
      : provider.specifications.some((spec) => spec.name === specFilter)
  );

  return (
    <div className="flex-1  min-h-screen bg-[#1e1e1e] p-8 text-white font-poppins">
         <div className="flex justify-between items-center mb-6">
      <h1 className="text-4xl font-bold mb-6 text-[#56B2BB]">Advertisement Providers</h1>
 <button
          onClick={() => setShowModal(true)}
          className="bg-[#56B2BB] hover:bg-[#4697a1] text-white px-5 py-2 rounded-lg shadow-md"
        >
          ➕ Add Provider
        </button></div>
      {/* Filter Dropdown */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2 font-medium">Filter by Specification:</label>
        <select
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-lg shadow-md 
                     focus:outline-none focus:ring-2 focus:ring-[#56B2BB] transition duration-200"
        >
          <option value="">All Specifications</option>
          {allSpecifications.map((spec, index) => (
            <option key={index} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <p className="text-gray-400">No providers match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-gray-900 p-5 rounded-2xl shadow-lg border border-gray-700 
                         hover:border-[#56B2BB] hover:shadow-[#56B2BB]/30 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-white mb-2">{provider.fullName}</h2>
              <p className="text-gray-300 text-sm mb-1">📧 {provider.email}</p>
              <p className="text-gray-300 text-sm mb-1">📞 {provider.phone}</p>
              <p className="text-gray-300 text-sm mb-3">🏫 {provider.instituteName}</p>

              {/* Specifications as Tags */}
              <div className="flex flex-wrap gap-2">
                {provider.specifications.map((spec) => (
                  <span
                    key={spec.id}
                    className="bg-[#56B2BB]/20 text-[#56B2BB] px-3 py-1 rounded-full text-xs font-medium 
                               hover:bg-[#56B2BB]/30 transition duration-200"
                  >
                    {spec.name}
                  </span>
                ))}
              </div>

              {/* Button */}
              <div className="mt-4">
                <button className="w-full bg-[#56B2BB] hover:bg-[#4697a1] text-white py-2 rounded-lg shadow-md transition duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}{showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <AddAdvertisementProvider 
            onClose={() => setShowModal(false)} 
            onSuccess={loadProviders} 
          />
        </div>
      )}
    </div>
  );
}
