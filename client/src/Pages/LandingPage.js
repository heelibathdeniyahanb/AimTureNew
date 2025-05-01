import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-mode', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-mode', 'light');
    }
  }, []);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.setAttribute('data-mode', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-mode', 'light');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen font-sans p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-teal-500 rounded-full shadow-lg"></div>
            <h1 className="text-4xl font-bold">AimTure</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="#" className="text-gray-800 dark:text-white hover:text-teal-500">Contact</Link>
            <Link to="/login" className="text-gray-800 dark:text-white hover:text-teal-500">Sign In</Link>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun className="h-6 w-6 text-teal-500" /> : <Moon className="h-6 w-6 text-gray-800" />}
            </button>
          </nav>
        </header>

        <main className="text-center">
          <h2 className="text-5xl font-extrabold text-teal-600 dark:text-teal-400 mb-6">Create Your Learning Path</h2>
          <p className="text-lg max-w-3xl mx-auto mb-12">
            Our AI-driven platform generates personalized learning journeys based on your goals, helping you grow and achieve success faster.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: "Skill Assessment", description: "Assess your current skill level to know where to start.", icon: "👩‍💻" },
              { title: "Custom Learning Paths", description: "Get personalized learning paths based on your needs.", icon: "🛤" },
              { title: "Progress Tracking", description: "Track your progress and see how you're advancing.", icon: "📈" }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <button className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-105">
            Get Started
          </button>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
