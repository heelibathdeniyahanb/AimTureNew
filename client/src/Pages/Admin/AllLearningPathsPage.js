import React from 'react';
import { Link } from 'react-router-dom';
import AllLearningPaths from '../../Components/Admin/AllLearningPaths';

export default function AllLearningPathsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-[#f0f4f8] font-poppins">My Learning Paths</h1>
      
      {/* Navigation Button to Dashboard */}
      <Link
        to="/admin/dashboard/page"
        className="inline-block text-sm bg-[#2d6166] border-[#56b2bb] border-2 px-4 py-2 rounded-xl text-[#f0f4f8] hover:bg-[#19191a] hover:border-[#56b2bb] transition font-poppins font-semibold"
      >
        Go to Dashboard
      </Link>

      {/* Your learning path content goes here */}
      <div className="mt-3">
        <AllLearningPaths/>      </div>
    </div>
  );
}
