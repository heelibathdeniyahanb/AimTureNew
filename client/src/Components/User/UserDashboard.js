import { useNavigate } from "react-router-dom";
import { fetchAdvertisements } from "../Apis/AdvertisementsApi";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faTint, faCloud } from '@fortawesome/free-solid-svg-icons';
import { fetchLearningPaths } from "../Apis/LearningPathApi";
import { createLearningPath } from "../Apis/LearningPathApi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const UserDashboard = () => {
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);


  const [isLoading, setIsLoading] = useState(false);
  const [newPath, setNewPath] = useState({
  goal: "",
  level: "",
  deadline: "",
});


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleViewTopics = (path) => {
    setSelectedPath(path);
    setIsTopicModalOpen(true);
  };
  
  useEffect(() => {
    const getAds = async () => {
      const ads = await fetchAdvertisements();
      setAdvertisements(ads);
    };
    
    getAds();
  }, []);

  const refreshLearningPaths = async () => {
    const updatedPaths = await fetchLearningPaths();
    setLearningPaths(updatedPaths);
  };

  useEffect(() => {
    const getLearningPaths = async () => {
      const paths = await fetchLearningPaths();
      setLearningPaths(paths);
    };

    getLearningPaths();
  }, []);

  const handleCreateLearningPath = async () => {
  setIsLoading(true);
  try {
    await createLearningPath(newPath);
    await refreshLearningPaths();
    setIsModalOpen(false);
    toast.success("Learning path created successfully!");
  } catch (error) {
    console.error("Failed to create learning path", error);
    toast.error("Failed to create learning path");
  } finally {
    setIsLoading(false);
  }
};

  

  const getClosestDeadlines = (count = 4) => {
    const today = new Date();
  
    // Sort by deadline ascending
    const sortedPaths = [...learningPaths]
      .filter(path => new Date(path.deadline) > today) // Only future deadlines
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // Earliest first
  
    return sortedPaths.slice(0, count); // Take first `count` deadlines
  };
  
  const closestDeadlines = getClosestDeadlines();
  
  
   // Assuming the deadline is passed as a string (e.g., "2025-05-30")
   const getDeadlineStatus = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - currentDate;
    const dayDiff = timeDiff / (1000 * 3600 * 24); // Convert to days
  
    if (dayDiff <= 2) {
      return { status: "fire", icon: faFire, color: "bg-red-500" }; // Close deadline (1 day or less)
    } else if (dayDiff <= 7) {
      return { status: "water", icon: faTint, color: "bg-blue-500" }; // Normal deadline (within 1 week)
    } else {
      return { status: "cloud", icon: faCloud, color: "bg-gray-500" }; // Far deadline (more than a week)
    }
  };
  

  return (
    <div className="min-h-screen bg-[#1E1E1E] p-8 space-y-6 text-[#f0f4f8] transition-colors duration-500 flex font-poppins">
      {/* Left Side Dashboard Content */}
      <div className="flex-1">
      <div className="flex justify-end"> {/* Align to the right */}
      <button
  onClick={() => setIsModalOpen(true)}
  className="bg-[#2d6166] text-sm text-[#f0f4f8] border-[#56b2bb] border-2 px-4 py-2 rounded-xl font-semibold hover:bg-[#19191a] hover:border-[#56b2bb] transition"
>
  New Learning Path
</button>

        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* Number of Learning Paths */}
          <div className="bg-[#19191A] p-6 rounded-2xl shadow-md flex flex-col justify-between hover:shadow-lg transition border border-[#2a2a2a] ">
            <h2 className="text-xl font-bold mb-4 font-poppins">Learning Paths</h2>
            <p className="text-4xl font-bold text-[#56b2bb] font-sans">{learningPaths.length}</p>

          </div>

          

         
          
        </div>

    {/* Deadlines Section */}
<div className="bg-[#19191A] p-6 rounded-2xl shadow-md flex flex-col transition border border-[#2a2a2a] mt-5">
  <ToastContainer position="top-right" autoClose={3000} />

  <h2 className="text-xl font-bold mb-4 font-poppins">Upcoming Deadlines</h2>

  {closestDeadlines.length > 0 ? (
    closestDeadlines.map((path, index) => (
      <div key={index}>
        <div className="flex items-center justify-between mb-4 font-sans">
          <div>
            <p className="text-lg">{path.goal}</p>
            <p className="text-sm text-gray-400">{new Date(path.deadline).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`text-white ${getDeadlineStatus(path.deadline).color} px-3 py-2 rounded-xl flex items-center justify-center`}
            >
              <FontAwesomeIcon icon={getDeadlineStatus(path.deadline).icon} size="lg" />
            </div>
            <button 
  onClick={() => setSelectedPath(path)}
  className="bg-[#56b2bb] text-white px-4 py-1.5 rounded-lg hover:bg-[#56b1bb] transition text-sm"
>
  View
</button>


          </div>
        </div>

        {/* Horizontal line after each item except the last */}
        {index !== closestDeadlines.length - 1 && (
          <hr className="border-t border-[#2a2a2a] my-4" />
        )}
      </div>
    ))
  ) : (
    <p className="text-white">No upcoming deadlines</p>
  )}
</div>

</div>
      {/* Right Side - Advertisements */}
      <div className="w-1/4 h-full ml-6 flex flex-col">
        {advertisements.map((ad) => (
          <div key={ad.id} className="flex-1 bg-[#56b2bb] p-4 mb-4 text-white font-semibold rounded-xl shadow-md flex justify-center items-center">
            <a href={ad.link} className="block text-center"><img
                  src={ad.imageUrl} // Assuming the API returns 'imageUrl' for the ad image
                  alt="Advertisement"
                  className="w-full h-full object-cover rounded-xl" // Ensures the image covers the space with rounded corners
                /></a>
          </div>
        ))}
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-[#19191A] p-8 rounded-2xl w-full max-w-md shadow-lg space-y-6 relative">
      <h2 className="text-2xl font-bold text-white">Create New Learning Path</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Path Name"
          className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none"
          value={newPath.goal}
          onChange={(e) => setNewPath({ ...newPath, goal: e.target.value })}
        />

        <select
  className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none"
  value={newPath.level}
  onChange={(e) => setNewPath({ ...newPath, level: e.target.value })}
>
  <option value="">Select Level</option>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select>

        <input
          type="date"
          className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none"
          value={newPath.deadline}
          onChange={(e) => setNewPath({ ...newPath, deadline: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleCreateLearningPath}
          className="bg-[#56b2bb] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[#56b1bb]"
        >
          Create
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{selectedPath && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-[#19191A] p-8 rounded-2xl w-full max-w-2xl shadow-lg space-y-6 relative max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#56b2bb] scrollbar-track-[#2a2a2a]">
      <h2 className="text-2xl font-bold text-white mb-4">
        {selectedPath.goal} - Topics
      </h2>

      {/* Topics Rendering */}
      <div className="space-y-6">
        {selectedPath.topics && selectedPath.topics.length > 0 ? (
          selectedPath.topics.map((topic, index) => (
            <div key={index} className="bg-[#2a2a2a] p-4 rounded-xl text-white shadow-sm">
              <h3 className="font-bold text-lg mb-2">{topic.topicName}</h3>
              {topic.videoLinks && topic.videoLinks.length > 0 ? (
                <ul className="list-disc pl-6 space-y-1 text-sm text-blue-400">
                  {topic.videoLinks.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No video links available</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-white">No topics available.</p>
        )}
      </div>

      {/* Close Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setSelectedPath(null)}
          className="bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}




    </div>
  );
};

export default UserDashboard;
