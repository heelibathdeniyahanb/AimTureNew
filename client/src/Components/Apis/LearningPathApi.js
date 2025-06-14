// This file handles fetching learning paths from the API or providing demo data as fallback

const fetchLearningPaths = async () => {
    try {
      // Replace with your actual API URL
      const response = await fetch("https://localhost:7295/api/GoogleAi/learning-paths");
  
      // If the response is successful, return the data
      if (response.ok) {
        const learningPaths = await response.json();
        return learningPaths;
      } else {
        // If the response is not successful, throw an error
        throw new Error("Failed to fetch learning paths");
      }
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      // Provide demo data if the API fetch fails
      return demoLearningPaths;
    }
  };
  
  // Demo data to be used if the API fails
  const demoLearningPaths = [
    {
      id: 1,
      name: "React Basics",
      description: "Learn the basics of React.js.",
      deadline: "2025-04-29",
      status: "fire", // Status like "fire", "water", "cloud"
    },
    {
      id: 2,
      name: "Advanced CSS",
      description: "Master CSS for advanced layouts.",
      deadline: "2025-07-01",
      status: "water", // Status like "fire", "water", "cloud"
    },
    {
      id: 3,
      name: "Node.js for Backend",
      description: "Learn to build backend services with Node.js.",
      deadline: "2025-08-01",
      status: "cloud", // Status like "fire", "water", "cloud"
    },
  ];

 const createLearningPath = async (pathData) => {
  try {
    const response = await fetch("https://localhost:7295/api/GoogleAi/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pathData), // ← now sending actual data
    });

    if (response.ok) {
      const newPath = await response.json();
      return newPath;
    } else {
      throw new Error("Failed to generate learning path");
    }
  } catch (error) {
    console.error("Error creating learning path:", error);
    throw error;
  }
};

  
  export { fetchLearningPaths };
  export {createLearningPath};
  