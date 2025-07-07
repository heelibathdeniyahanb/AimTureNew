import React, { useEffect, useState, useContext } from "react";
import { getLearningPathsByUser } from "../Apis/LearningPathApi";
import { UserContext } from "../UserContext";

export default function LearningPathByUser() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);

  const context = useContext(UserContext);
  const user = context?.user;

  useEffect(() => {
    // Don't fetch if user or user.id is missing
    if (!user || !user.id) {
      console.warn("User or user.id is missing, skipping fetch.");
      return;
    }

    const getPaths = async () => {
      try {
        const paths = await getLearningPathsByUser(user.id);
        setLearningPaths(paths);
      } catch (error) {
        console.error("Failed to fetch learning paths:", error);
      }
    };

    getPaths();
  }, [user]);

  const handleSelectPath = (path) => {
    setSelectedPath(path);
    console.log("Selected learning path:", path);
  };
  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#f0f4f8] pt-3 flex font-poppins space-x-6">
      {/* Sidebar */}
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
              <p className="text-xs text-gray-400">
                {new Date(path.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No Learning Paths Found</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#19191A] p-6 rounded-2xl shadow-md border border-[#2a2a2a] overflow-y-auto max-h-[80vh]">
        {selectedPath ? (
          <div>
            <h2 className="text-xl font-bold mb-4 font-nunito">{selectedPath.goal}</h2>
            <p className="text-gray-400 mb-2 font-sans">
              Deadline: {new Date(selectedPath.deadline).toLocaleDateString()}
            </p>

            <h3 className="text-xl font-semibold mb-2 font-nunito">Topics</h3>
            <ul className="list-disc list-inside mb-4">
              {selectedPath.topics?.map((topic, index) => (
                <li key={index} className="mb-2">
                  <strong>{topic.topicName}</strong>
                  <ul className="mt-1 pl-4 list-decimal text-sm">
                    {topic.videoLinks?.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
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
