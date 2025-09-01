import React from "react";
import "./CardAnimations.css";

const AnimatedCard = ({ type, children }) => {
  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border border-[#3a3a3a]">
      {/* Background animations */}
      {type === "ice" &&
        Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="snowflake" style={{ left: `${i * 5 + 5}%`, animationDuration: `${3 + i % 5}s`, animationDelay: `${i % 5}s` }}></div>
        ))}

      {type === "fire" &&
        Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="spark" style={{ left: `${i * 6 + 5}%`, animationDuration: `${2 + i % 3}s`, animationDelay: `${i % 3}s` }}></div>
        ))}

      {type === "water" &&
        Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="raindrop" style={{ left: `${i * 5 + 5}%`, animationDuration: `${2 + i % 3}s`, animationDelay: `${i % 3}s` }}></div>
        ))}

      {type === "cloud" &&
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="cloud" style={{ top: `${20 + i * 10}%`, animationDuration: `${20 + i * 5}s`, animationDelay: `${i * 3}s` }}></div>
        ))}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
        {children}
      </div>
    </div>
  );
};

export default AnimatedCard;
