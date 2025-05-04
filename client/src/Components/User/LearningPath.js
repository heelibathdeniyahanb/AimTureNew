import React, { useEffect, useState } from "react";
import { fetchLearningPaths } from "../Apis/LearningPathApi";

export default function LearningPath() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    const getPaths = async () => {
      const paths = await fetchLearningPaths();
      setLearningPaths(paths);
    };

    getPaths();
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#f0f4f8] pt-3 flex font-poppins space-x-6">

      {/* Sidebar - List of Paths */}
      <div className="w-1/4 bg-[#19191A] p-3 rounded-xl shadow-md border border-[#2a2a2a] overflow-y-auto max-h-[80vh]">
        

        {learningPaths.length > 0 ? (
          learningPaths.map((path, index) => (
            <div
              key={index}
              onClick={() => setSelectedPath(path)}
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
