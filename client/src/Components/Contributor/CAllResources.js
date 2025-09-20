import React, { useEffect, useState, useContext } from "react";
import { FaDownload, FaEye, FaFile, FaPlus } from "react-icons/fa";
import { getAllContents, createContent } from "../Apis/ContentApi";
import axios from "axios";
import { UserContext } from "../UserContext";

// Fetch Content Types
const getContentTypes = async () => {
  const response = await axios.get("https://localhost:7295/api/ContentType");
  return response.data;
};

// Fetch Specifications
const getSpecifications = async () => {
  const response = await axios.get("https://localhost:7295/api/Specification");
  return response.data;
};

// Fetch contributor by user id
export const getContributorByUserId = async (userId) => {
  const res = await fetch(`https://localhost:7295/api/Contributor/by-user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch contributor");
  return await res.json();
};

export default function CAllResources() {
  const { user } = useContext(UserContext);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [contentTypes, setContentTypes] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [contributorId, setContributorId] = useState(null); // store fetched ContributorId

  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    url: "",
    contentTypeId: "",
    SpecializationIds: [],
    file: null,
  });

  // Fetch all contents
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await getAllContents();
        // Sort contents by createdAt date in descending order (newest first)
        const sortedContents = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setContents(sortedContents);
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [types, specs] = await Promise.all([getContentTypes(), getSpecifications()]);
        setContentTypes(types);
        setSpecifications(specs);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch ContributorId when modal opens
  useEffect(() => {
    if (showModal) {
      getContributorByUserId(user.id)
        .then((contributor) => {
          console.log("Contributor ID:", contributor.id);
          setContributorId(contributor.id);
        })
        .catch((err) => console.error("Error fetching contributor:", err));
    }
  }, [showModal, user.id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setNewContent((prev) => ({ ...prev, file: files[0] }));
    } else if (name === "SpecializationIds") {
      const selectedOptions = Array.from(e.target.selectedOptions).map((opt) =>
        parseInt(opt.value)
      );
      setNewContent((prev) => ({ ...prev, SpecializationIds: selectedOptions }));
    } else {
      setNewContent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contributorId) {
      console.error("ContributorId not available yet!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", newContent.title);
      formData.append("Description", newContent.description);
      formData.append("Url", newContent.url);
      formData.append("ContentTypeId", newContent.contentTypeId);
      formData.append("ContributorId", contributorId); // use fetched contributorId

      if (newContent.SpecializationIds && newContent.SpecializationIds.length > 0) {
        newContent.SpecializationIds.forEach((id) =>
          formData.append("SpecializationIds", id)
        );
      }

      if (newContent.file) formData.append("File", newContent.file);

      const created = await createContent(formData);
      // Add new content to the beginning of the array
      setContents(prevContents => [created, ...prevContents]);
      setShowModal(false);

      setNewContent({
        title: "",
        description: "",
        url: "",
        contentTypeId: "",
        SpecializationIds: [],
        file: null,
      });
      setContributorId(null);
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  // Helper to get file extension
  const getFileExtension = (url) => {
    if (!url) return "";
    const path = new URL(url).pathname;
    return path.substring(path.lastIndexOf(".")).toLowerCase();
  };

  // Helper to download files
  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading resources...
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1e1e1e] min-h-screen text-[#f0f4f8]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#56B2BB]">All Resources</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <FaPlus /> Add New Content
        </button>
      </div>

      {contents.length === 0 ? (
        <p className="text-gray-400">No resources available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <div
              key={content.id}
              className="bg-[#292929] rounded-xl shadow-lg p-5 flex flex-col hover:scale-105 transition"
            >
              <h2 className="text-xl font-semibold text-[#56B2BB] mb-2">
                {content.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {content.description || "No description available"}
              </p>

              {content.url ? (
                <div className="relative w-full h-40 bg-[#1e1e1e] rounded-md mb-4 flex items-center justify-center">
                  {content.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={content.url}
                      alt={content.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaFile className="text-red-400 text-5xl" />
                  )}
                </div>
              ) : (
                <div className="w-full h-40 bg-[#1e1e1e] rounded-md flex items-center justify-center mb-4">
                  <FaFile className="text-gray-500 text-5xl" />
                </div>
              )}

              <div className="text-sm text-gray-400 mb-4">
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {content.specializationNames?.join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {content.contentTypeName || "N/A"}
                </p>
              </div>

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
                      onClick={() =>
                        downloadFile(
                          content.url,
                          content.title + getFileExtension(content.url)
                        )
                      }
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-6 rounded-xl w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-4 text-[#56B2BB]">
              Add New Content
            </h2>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newContent.title}
                onChange={handleChange}
                className="p-2 rounded bg-[#292929] text-white"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newContent.description}
                onChange={handleChange}
                className="p-2 rounded bg-[#292929] text-white"
              />
              <input
                type="text"
                name="url"
                placeholder="Url"
                value={newContent.url}
                onChange={handleChange}
                className="p-2 rounded bg-[#292929] text-white"
              />

              <select
                name="contentTypeId"
                value={newContent.contentTypeId}
                onChange={handleChange}
                className="p-2 rounded bg-[#292929] text-white"
                required
              >
                <option value="">Select Content Type</option>
                {contentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              <select
                name="SpecializationIds"
                multiple
                value={newContent.SpecializationIds}
                onChange={handleChange}
                className="p-2 rounded bg-[#292929] text-white h-32"
              >
                {specifications.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>

              <input
                type="file"
                name="file"
                onChange={handleChange}
                className="p-2 rounded bg-[#292929] text-white"
              />

              <button
                type="submit"
                disabled={!contributorId} // prevent submit until contributorId is loaded
                className={`mt-3 px-4 py-2 rounded-lg text-white ${
                  contributorId
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
