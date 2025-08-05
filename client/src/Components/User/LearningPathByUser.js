import React, { useEffect, useState, useContext } from "react";
import { getLearningPathsByUser, markTopicCompleted } from "../Apis/LearningPathApi";
import { UserContext } from "../UserContext";

export default function LearningPathByUser() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const context = useContext(UserContext);
  const user = context?.user;

  useEffect(() => {
    if (!user?.id) return;

    const fetchPaths = async () => {
      try {
        const paths = await getLearningPathsByUser(user.id);
        setLearningPaths(paths);
      } catch (err) {
        console.error("Failed to fetch learning paths:", err);
      }
    };

    fetchPaths();
  }, [user]);

  const handleSelectPath = (path) => {
    setSelectedPath(path);
  };

  // ✅ Toggle Completion Status
  const handleToggleCompletion = async (topicId, currentStatus) => {
    try {
      await markTopicCompleted(topicId, !currentStatus);

      // ✅ Update local state to reflect change immediately
      const updatedPath = {
        ...selectedPath,
        topics: selectedPath.topics.map((t) =>
          t.id === topicId ? { ...t, isCompleted: !currentStatus } : t
        )
      };
      setSelectedPath(updatedPath);

      // ✅ Update learningPaths list as well
      setLearningPaths((prev) =>
        prev.map((lp) =>
          lp.id === selectedPath.id ? updatedPath : lp
        )
      );
    } catch (err) {
      console.error("Failed to update topic completion:", err);
    }
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
              {/* ✅ Show Completion Percentage */}
              <p className="text-xs text-green-400">
                {path.completionPercentage}% Completed
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

            {/* ✅ Show Overall Progress */}
            <div className="w-full bg-gray-700 rounded h-3 mb-4">
              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${selectedPath.completionPercentage || 0}%` }}
              ></div>
            </div>
            <p className="text-sm text-green-400 mb-2">
              {selectedPath.completionPercentage || 0}% Completed
            </p>

            <h3 className="text-xl font-semibold mb-2 font-nunito">Topics</h3>
            <ul className="list-disc list-inside mb-4">
              {selectedPath.topics?.map((topic) => (
                <li key={topic.id} className="mb-3">
                  <div className="flex items-center space-x-3">
                    {/* ✅ Checkbox to toggle completion */}
                    <input
                      type="checkbox"
                      checked={topic.isCompleted}
                      onChange={() => handleToggleCompletion(topic.id, topic.isCompleted)}
                      className="w-4 h-4 cursor-pointer accent-green-500"
                     
                    />
                    <strong className={topic.isCompleted ? "line-through text-gray-400" : ""}>
                      {topic.topicName}
                    </strong>
                    <span className="text-xs text-gray-400">
                      {new Date(topic.topicDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Video Links */}
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
