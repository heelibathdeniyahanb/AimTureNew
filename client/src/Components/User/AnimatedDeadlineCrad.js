import React from "react";
import "./CardAnimation.Css";

const AnimatedDeadlineCard = ({ path, status,onView }) => {
  const progress = Math.min(Math.max(path.completionPercentage || 0, 0), 100);

  const getAnimationElements = () => {
    switch (status.status) {
      case "ice":
        return Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${i * 6}%`,
              animationDuration: `${3 + (i % 5)}s`,
              animationDelay: `${i % 5}s`,
            }}
          ></div>
        ));
      case "fire":
        return Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="spark"
            style={{
              left: `${i * 7}%`,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${i % 3}s`,
            }}
          ></div>
        ));
      case "water":
        return Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${i * 5}%`,
              animationDuration: `${2 + (i % 3)}s`,
              animationDelay: `${i % 3}s`,
            }}
          ></div>
        ));
      case "cloud":
        return Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="cloud"
            style={{
              top: `${20 + i * 10}%`,
              animationDuration: `${20 + i * 5}s`,
              animationDelay: `${i * 3}s`,
            }}
          ></div>
        ));
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative p-4 rounded-2xl shadow-md border border-[#3a3a3a] overflow-hidden ${status.cardClass} ${status.animation}`}
    >
      {/* Animated background */}
      {getAnimationElements()}

      {/* Card content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h3 className={`text-lg font-bold ${status.textColor}`}>{path.goal}</h3>
          <p className={`${status.textColor} text-sm`}>
            {new Date(path.deadline).toLocaleDateString()}
          </p>
          <p className={`${status.textColor} text-sm mt-1`}>
            {progress}% completed
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-gray-700 overflow-hidden mt-3">
          <div
            className={`h-full rounded-full transition-all duration-500 ${status.color || "bg-white"}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* View Button */}
         <button
          onClick={() => onView(path)} // Pass path to parent
          className="mt-4 w-full bg-[#56b2bb] text-white py-2 rounded-lg font-semibold hover:bg-[#56b1bb] transition"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default AnimatedDeadlineCard;
