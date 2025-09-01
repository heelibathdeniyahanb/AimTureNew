import { useNavigate } from "react-router-dom";
import { fetchRecommendedAdvertisements } from "../Apis/AdvertisementsApi";
import { useState, useEffect,useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faTint, faCloud,faMagicWandSparkles,faWandSparkles,faZap,faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { getLearningPathsByUser } from "../Apis/LearningPathApi";
import { createLearningPath } from "../Apis/LearningPathApi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../UserContext";
import { LuTarget,LuBook, LuBookOpen } from "react-icons/lu";

import { FaStar, FaBolt } from "react-icons/fa";
import AnimatedDeadlineCard from "./AnimatedDeadlineCrad";


const UserDashboard = () => {
  const navigate = useNavigate();
  const [advertisements, setAdvertisements] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [quoteText, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const context = useContext(UserContext);
    const {user}=context;
    const colors = ["from-blue-500 to-indigo-500", "from-purple-500 to-pink-500"];
     const defaultCTA = "Learn More"; 


  const [isLoading, setIsLoading] = useState(false);
  const [newPath, setNewPath] = useState({
  goal: "",
  level: "",
  deadline: "",
  userId:user.id
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
    if (!user?.id) return;
    const ads = await fetchRecommendedAdvertisements(user.id); // fetch by user id
    setAdvertisements(ads);
  };

  getAds();
}, [user]);

  const refreshLearningPaths = async () => {
  if (!user?.id) return;
  const updatedPaths = await getLearningPathsByUser(user.id);
  setLearningPaths(updatedPaths);
};


  useEffect(() => {
  const getLearningPaths = async () => {
    if (!user?.id) return;
    const paths = await getLearningPathsByUser(user.id); // fetch by user ID
    setLearningPaths(paths);
  };

  getLearningPaths();
}, [user]); 


  const handleCreateLearningPath = async () => {
  setIsLoading(true);
  try {
     console.log("userid:",user.id);
    await createLearningPath(newPath);
    console.log("userid:",user.id);
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
  const getDeadlineStatus = (path) => {
  const currentDate = new Date();
  const deadlineDate = new Date(path.deadline);
  const timeDiff = deadlineDate - currentDate;
  const dayDiff = timeDiff / (1000 * 3600 * 24);

  let status = { status: '', cardClass: '', textColor: '', animation: '' };

  if ((path.completionPercentage || 0) < 30) {
    // Low completion → Ice
    status = { 
      status: "ice", 
      cardClass: "card-ice", 
      textColor: "text-blue-900", 
      animation: "animate-pulseIce" 
    };
  } else if (dayDiff <= 2) {
    // Close deadline → Fire
    status = { 
      status: "fire", 
      cardClass: "card-fire", 
      textColor: "text-yellow-100", 
      animation: "animate-flicker" 
    };
  } else if (dayDiff <= 7) {
    // Medium → Water
    status = { 
      status: "water", 
      cardClass: "card-water", 
      textColor: "text-blue-100", 
      animation: "animate-waveWater" 
    };
  } else {
    // Far → Cloud
    status = { 
      status: "cloud", 
      cardClass: "card-cloud", 
      textColor: "text-gray-800", 
      animation: "animate-floatCloud" 
    };
  }

  return status;
};



  
  useEffect(() => {
  const fetchQuote = async () => {
    try {
      const res = await fetch("https://localhost:7295/api/Quotes/random-quote");
      if (!res.ok) throw new Error("Failed to fetch quote");
      const data = await res.json();
      setQuote(data.quoteText);
      setAuthor(data.author);
    } catch (error) {
      console.error(error);
      setQuote("Keep pushing forward!");
      setAuthor("Anonymous");
    }
  };

  fetchQuote();
  const interval = setInterval(fetchQuote, 15000);
  return () => clearInterval(interval);
}, []);


  return (
    <div className="min-h-screen bg-[#1E1E1E] p-8 space-y-6 text-[#f0f4f8] transition-colors duration-500 flex font-poppins">
      {/* Left Side Dashboard Content */}
      <div className="flex-1">
         
         <div className="p-4 rounded-lg shadow-lg bg-white max-w-lg">
      <p className="text-lg italic text-gray-800">{quoteText}</p>
      <p className="text-right mt-2 text-sm text-gray-500">- {author}</p>
    </div>
      <div className="flex justify-end"> {/* Align to the right */}
       
      <button
  onClick={() => setIsModalOpen(true)}
  className="bg-[#2d6166] text-sm text-[#f0f4f8] border-[#56b2bb] border-2 px-4 py-2 rounded-xl font-semibold hover:bg-[#19191a] hover:border-[#56b2bb] transition flex space x-4"
><LuTarget className="h-4 w-4 mr-2" ></LuTarget>
  New Learning Path
</button>

        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* Number of Learning Paths */}
          
  {/* Title */}
  <div className="bg-[#19191A] p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-[#2a2a2a] flex items-center w-full max-w-sm">
      {/* Icon */}
      <LuBookOpen className="h-8 w-8 text-blue-400 mr-4" />

      {/* Text */}
      <div>
        <p className="text-2xl font-bold text-white">{learningPaths.length}</p>
        <p className="text-sm text-gray-400">LearningPaths</p>
      </div>
    </div>



</div>

    {/* Deadlines Section */}
{/* Deadlines Section */}
<div className="bg-[#19191A] p-6 rounded-2xl shadow-md flex flex-col transition border border-[#2a2a2a] mt-5">
  <ToastContainer position="top-right" autoClose={3000} />

  <h2 className="text-xl font-bold mb-4 font-poppins">Upcoming Deadlines</h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {closestDeadlines.length > 0 ? (
    closestDeadlines.map((path, index) => (
      <AnimatedDeadlineCard
        key={index}
        path={path}
        status={getDeadlineStatus(path)}
        onView={(p) => setSelectedPath(p)}
      />
    ))
  ) : (
    <div className="col-span-full bg-[#2a2a2a] p-6 rounded-2xl text-center text-gray-400 shadow-md">
      No learning paths yet. Create a new learning path to get started!
      <div className="mt-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700"
        >
          Create Learning Path
        </button>
      </div>
    </div>
  )}
</div>



</div>


</div>
      {/* Right Side - Advertisements */}
    <div className="w-1/4 h-full ml-6 flex flex-col">
  <h3 className="text-lg font-semibold text-foreground mb-4">Recommended for You</h3>

  {advertisements && advertisements.length > 0 ? (
    advertisements.map((ad, index) => (
      ad.imageUrl ? (
        <div
          key={ad.id}
          className="flex-1 bg-[#56b2bb] p-4 mb-4 text-white font-semibold rounded-xl shadow-md flex justify-center items-center"
        >
          <a href={ad.link} className="block text-center">
            <img
              src={ad.imageUrl}
              alt="Advertisement"
              className="w-full h-full object-cover rounded-xl"
            />
          </a>
        </div>
      ) : (
        <div
          key={ad.id}
          className={`bg-gradient-to-br ${colors[index % colors.length]} text-white rounded-xl shadow-lg overflow-hidden mb-4`}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 text-xs rounded bg-white bg-opacity-20 capitalize">
                {ad.type}
              </span>
              {ad.rating && (
                <div className="flex items-center text-sm">
                  <FaStar className="h-4 w-4 mr-1 text-yellow-300" />
                  {ad.rating}
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg mb-2">{ad.title}</h3>
            <p className="text-sm opacity-90 mb-3">{ad.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-80">by {ad.providerName}</span>
              {ad.price && <span className="font-semibold">{ad.price}</span>}
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              <FaBolt className="h-4 w-4" />
              {defaultCTA}
            </button>

            <p className="text-xs opacity-70 mt-2 text-center">*Sponsored</p>
          </div>
        </div>
      )
    ))
  ) : (
    <p>No advertisements available.</p>
  )}
</div>


      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-[#19191A] p-8 rounded-2xl w-full max-w-2xl mx-auto shadow-lg space-y-6 relative mb-16">
      <div className="flex items-center justify-center space-x-2 text-card-foreground">
      <FontAwesomeIcon icon={faMagicWandSparkles} className="h-6 w-6 text-yellow-400" />
      <span className="text-2xl font-bold text-white">Create New Learning Path</span></div>

      <p className="text-muted-foreground text-sm"> Tell us your goal, deadline, and experience level for a personalized learning journey</p>

      <div className="space-y-4">
        <label className="text-sm font-medium text-card-foreground">What do you want to learn?</label>
        <input
          type="text"
          placeholder="e.g., Python Programming, Digital Marketing, Data Science..."
          className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none mt-1"
          value={newPath.goal}
          onChange={(e) => setNewPath({ ...newPath, goal: e.target.value })}
        />
 <div className="grid grid-cols-2 gap-4">
  <div>
  <label className="text-sm font-medium text-card-foreground">Experience Level</label>
        <select
  className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none mt-1"
  value={newPath.level}
  onChange={(e) => setNewPath({ ...newPath, level: e.target.value })}
>
  <option value="">Select Level</option>
  <option value="Beginner">Beginner</option>
  <option value="Intermediate">Intermediate</option>
  <option value="Advanced">Advanced</option>
</select></div>
<div>
 <label className="text-sm font-medium text-card-foreground">Target Deadline</label>
        <input
          type="date"
          className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white focus:outline-none mt-1"
          value={newPath.deadline}
          onChange={(e) => setNewPath({ ...newPath, deadline: e.target.value })}
        /></div>
      </div></div>

      <div className="grid grid-cols-2 gap-4 space-x-4 mt-6">
        <button
          onClick={handleCreateLearningPath}
          className="bg-blue-600 w-full px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700"
        > {isLoading ? (
                    <>
                      <FontAwesomeIcon icon={faWandSparkles} className="h-4 w-4 mr-2 animate-spin" />
                      Generating AI Path...
                    </>
                  ) :( <>  <FontAwesomeIcon icon={faZap} className="h-4 w-4 mr-2"></FontAwesomeIcon> 
          Generate</>)}
          
         
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className=" border-2 border-black px-4 py-2 rounded-lg text-white font-semibold hover:bg-black"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{selectedPath && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out">
    <div className="bg-[#19191A] p-8 rounded-2xl w-full max-w-2xl shadow-lg space-y-6 relative max-h-[80vh] overflow-y-auto
                    scrollbar-thin scrollbar-thumb-[#56b2bb] scrollbar-track-[#2a2a2a]
                    transform scale-95 opacity-0 animate-modalFadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-4">
        <h2 className="text-2xl font-bold text-white">{selectedPath.goal} - Topics</h2>
        <button 
          onClick={() => setSelectedPath(null)} 
          className="text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      {/* Topics List */}
      <div className="space-y-6">
        {selectedPath.topics && selectedPath.topics.length > 0 ? (
          selectedPath.topics.map((topic, index) => (
            <div key={index} className="bg-[#2a2a2a] p-4 rounded-xl text-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-1">{topic.topicName}</h3>
              <p className="text-sm text-gray-400 mb-2">Deadline: {topic.topicDeadline}</p>

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
                <p className="text-gray-500 text-sm">No video links available</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-white text-sm">No topics available.</p>
        )}
      </div>

      {/* Footer Close Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setSelectedPath(null)}
          className="bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

  
</div>)}

export default UserDashboard;
