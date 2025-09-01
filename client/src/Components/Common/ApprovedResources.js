import React, { useEffect, useState } from "react";
import { FaDownload, FaEye, FaFile } from "react-icons/fa";
import { getAllContents } from "../Apis/ContentApi";

export default function ApprovedResources() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getAllContents();
        const approvedContents = data.filter((c) => c.isApproved);
        setContents(approvedContents);

        // Extract unique categories and types for filters
        const allCategories = [
          ...new Set(
            approvedContents.flatMap((c) => c.specializationNames || [])
          ),
        ];
        setCategories(allCategories);

        const allTypes = [
          ...new Set(approvedContents.map((c) => c.contentTypeName).filter(Boolean)),
        ];
        setTypes(allTypes);
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  // Get file extension
  const getFileExtension = (url) => {
    if (!url) return "";
    const path = new URL(url).pathname;
    return path.substring(path.lastIndexOf('.')).toLowerCase();
  };

  // Download function
  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading resources...</div>;
  }

  // Apply filters
  const filteredContents = contents.filter((c) => {
    const matchesCategory =
      categoryFilter === "All" || (c.specializationNames?.includes(categoryFilter));
    const matchesType =
      typeFilter === "All" || c.contentTypeName === typeFilter;
    return matchesCategory && matchesType;
  });

  return (
    <div className="p-6 bg-[#1e1e1e] min-h-screen text-[#f0f4f8]">
      <h1 className="text-3xl font-bold mb-6 text-[#56B2BB]">All Resources</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-gray-400 mb-1">Filter by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#292929] text-white px-3 py-2 rounded-lg"
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Filter by Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#292929] text-white px-3 py-2 rounded-lg"
          >
            <option value="All">All</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredContents.length === 0 ? (
        <p className="text-gray-400">No resources available for selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <div
              key={content.id}
              className="bg-[#292929] rounded-xl shadow-lg p-5 flex flex-col hover:scale-105 transition"
            >
              {/* Title & Description */}
              <h2 className="text-xl font-semibold text-[#56B2BB] mb-2">
                {content.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {content.description || "No description available"}
              </p>

              {/* File Preview Thumbnail */}
              {content.url ? (
                <div className="relative w-full h-40 bg-[#1e1e1e] rounded-md mb-4 overflow-hidden flex items-center justify-center">
                  {content.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={content.url}
                      alt={content.title}
                      className="object-cover w-full h-full"
                    />
                  ) : content.url.match(/\.(mp4|mov|avi|webm)$/i) ? (
                    <video className="object-cover w-full h-full" muted>
                      <source src={content.url} type="video/mp4" />
                    </video>
                  ) : content.url.match(/\.pdf$/i) ? (
                    <FaFile className="text-red-400 text-5xl" />
                  ) : (
                    <FaFile className="text-gray-400 text-5xl" />
                  )}
                </div>
              ) : (
                <div className="w-full h-40 bg-[#1e1e1e] rounded-md flex items-center justify-center mb-4">
                  <FaFile className="text-gray-500 text-5xl" />
                </div>
              )}

              {/* Category & Type */}
              <div className="text-sm text-gray-400 mb-4">
                <p><span className="font-semibold">Category:</span> {content.specializationNames?.join(", ") || "N/A"}</p>
                <p><span className="font-semibold">Type:</span> {content.contentTypeName || "N/A"}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                {content.url && (
                  <>
                    <button
                      onClick={() => window.open(content.url, "_blank")}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <FaEye size={12} /> View
                    </button>
                    <button
                      onClick={() => downloadFile(content.url, content.title + getFileExtension(content.url))}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center justify-center gap-1"
                    >
                      <FaDownload size={12} /> Download
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
