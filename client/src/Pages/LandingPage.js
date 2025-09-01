import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Images/aimture long.png';

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const navigate = useNavigate();

  // Load theme from localStorage or system preference
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

  // Toggle theme
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
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="logo" className="w-10 h-10 rounded-full shadow-lg object-cover"/>
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

        {/* Main Section */}
        <main className="text-center">
          <h2 className="text-5xl font-extrabold text-teal-600 dark:text-teal-400 mb-6">Create Your Learning Path</h2>
          <p className="text-lg max-w-3xl mx-auto mb-12">
            Our AI-driven platform generates personalized learning journeys based on your goals, helping you grow and achieve success faster.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {[
             
  { 
    title: "Learning Path Generation", 
    description: "Create personalized learning paths tailored to your goals.", 
    icon: "🛤" 
  },
  { 
    title: "Knowledge Bank", 
    description: "Explore a rich collection of learning resources and materials.", 
    icon: "📚" 
  },
  { 
    title: "Progress Tracking", 
    description: "Monitor your progress and stay on track with your learning journey.", 
    icon: "📈" 
  },
  { 
    title: "Advertisements & Opportunities", 
    description: "Discover relevant ads and opportunities aligned with your goals.", 
    icon: "💡" 
  }


            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Extra Section for Providers & Institutes */}
          <div className="bg-teal-50 dark:bg-gray-800 p-8 rounded-2xl shadow-md mb-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-teal-700 dark:text-teal-300">Opportunities for Content Providers & Institutes</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you a content creator? Upload your learning material to our platform and <span className="font-semibold">earn money</span> 
              while empowering learners worldwide. <br/><br/>
              Running an institute or academy? Advertise your programs with us and reach a <span className="font-semibold">targeted audience</span> 
              passionate about learning.
            </p>
            <div className="flex justify-center gap-6">
             <a 
  href="mailto:support@yourdomain.com" 
  className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 inline-block"
>
  Contact Us for Advertising
</a>

              
            </div>
          </div>

          {/* Get Started */}
          {!showSignupOptions ? (
            <button 
              className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-full font-semibold transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setShowSignupOptions(true)}
            >
              Get Started
            </button>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto">
              <div 
                onClick={() => navigate('/register-form')}
                className="cursor-pointer bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-semibold mb-3 text-teal-600 dark:text-teal-400">Sign Up as User</h3>
                <p className="text-gray-600 dark:text-gray-300">Create your personalized learning path and achieve your goals faster.</p>
              </div>
              <div 
                onClick={() => navigate('/signup-provider')}
                className="cursor-pointer bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Sign Up as Content Provider</h3>
                <p className="text-gray-600 dark:text-gray-300">Share your knowledge, grow your reach, and earn by helping learners worldwide.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
