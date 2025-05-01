import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // State to manage the current theme (light or dark)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply saved theme or system preference
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
    <div className="bg-white dark:bg-slate-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
            <h1 className="text-slate-900 dark:text-yellow-400 text-2xl font-bold">AimTure</h1>
          </div>
          <nav className="flex items-center space-x-6">
            
            <a href="#" className="text-slate-700 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-400">Contact us</a>
            <button className="bg-blue-500 hover:bg-blue-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-slate-900 px-4 py-2 rounded-full transition duration-300 ease-in-out">
              Try Now
            </button>
           <Link to='/login' className="text-slate-700 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-400">Sign in</Link>
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition duration-300 ease-in-out"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>
          </nav>
        </header>

        <main className="text-slate-900 dark:text-slate-200">
          <h2 className="text-blue-500 dark:text-yellow-400 text-5xl font-bold mb-6">LEARNING PATH GENERATION</h2>
          <p className="text-xl mb-12">Create personalized learning journeys with our AI-powered system.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Skill Assessment", description: "Evaluate your current skills and identify areas for improvement.", color: "bg-blue-500 dark:bg-blue-400" },
              { title: "Custom Pathways", description: "Get tailored learning paths based on your goals and skill level.", color: "bg-blue-700 dark:bg-blue-500" },
              { title: "Progress Tracking", description: "Monitor your learning journey and celebrate milestones.", color: "bg-blue-400 dark:bg-blue-600" }
            ].map((feature, index) => (
              <div key={index} className="bg-sky-100 dark:bg-slate-800 p-6 rounded-xl">
                <div className={`w-16 h-16 ${feature.color} rounded-full mb-4`}></div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-slate-900 px-6 py-3 rounded-full font-semibold transition duration-300 ease-in-out">
            Start Your Journey
          </button>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
