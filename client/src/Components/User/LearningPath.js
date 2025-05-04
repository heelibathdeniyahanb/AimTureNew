import React, { useEffect, useState } from "react";
import { fetchLearningPaths } from "../Apis/LearningPathApi";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LearningPath() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [youtubeResults, setYoutubeResults] = useState([]);

  useEffect(() => {
    const getPaths = async () => {
      const paths = await fetchLearningPaths();
      setLearningPaths(paths);
    };

    getPaths();
  }, []);

  // Fetch YouTube videos
  const fetchYoutubeVideos = async (query) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: "snippet",
          maxResults: 4,
          q: query,
          key: "AIzaSyDntVSeSF-JcmSgIr18p-ToKJQS-GZMlis"  // Replace with your key
        }
      });

      setYoutubeResults(res.data.items);
    } catch (err) {
      console.error("Failed to fetch YouTube videos", err);
    }
  };

  const handleSelectPath = (path) => {
    setSelectedPath(path);
    if (path.topics) {
      fetchYoutubeVideos(path.topics);  // Use the topics as search query
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#f0f4f8] pt-3 flex font-poppins space-x-6">

      {/* Sidebar - List of Paths */}
      <div className="w-1/4 bg-[#19191A] p-3 rounded-xl shadow-md border border-[#2a2a2a] overflow-y-auto max-h-[80vh]">
        

        {learningPaths.length > 0 ? (
          learningPaths.map((path) => (
            <div
            key={path.id} 
            onClick={() => handleSelectPath(path)}
              className={`cursor-pointer p-4 rounded-xl mb-4 border hover:bg-[#2a2a2a] transition ${
                selectedPath?.id === path.id ? "border-[#56b2bb]" : "border-[#2a2a2a]"
              }`}
            >
              <p className="text-sm font-semibold">{path.goal}</p>
              <p className="text-xs text-gray-400">{new Date(path.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No Learning Paths Found</p>
        )}
      </div>

      {/* Content Area - Path Details */}
      <div className="flex-1 bg-[#19191A] p-6 rounded-2xl shadow-md border border-[#2a2a2a] overflow-y-auto max-h-[80vh]">

        {selectedPath ? (
          <div>
            <h2 className="text-xl font-bold mb-4 font-nunito">{selectedPath.goal}</h2>
            <p className="text-gray-400 mb-2 font-sans">Deadline: {new Date(selectedPath.deadline).toLocaleDateString()}</p>
            <p className="mb-4 font-sans">{selectedPath.description}</p>

            <h3 className="text-xl font-semibold mb-2 font-nunito">Topics</h3>
            <pre className="whitespace-pre-wrap font-sans text-sm">{selectedPath.topics}</pre>

            <h3 className="text-lg font-semibold mt-6">Related YouTube Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {youtubeResults.map((video) => (
                <a 
                  key={video.id.videoId} 
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-[#2a2a2a] rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-full" />
                  <div className="p-2">
                    <p className="text-sm font-semibold">{video.snippet.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a learning path to view details</p>
          </div>
        )}

      </div>

    </div>
  );
}
