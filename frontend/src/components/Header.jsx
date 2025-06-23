import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNutrition } from '../context/NutritionContext';
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { requirements } = useNutrition();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-sm transition-colors duration-200`}>
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className={`h-8 w-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
              <path d="M12 6v2M12 16v2M6 12h2M16 12h2" />
            </svg>
            <Link to="/" className={`text-2xl font-bold hover:text-green-${darkMode ? '400' : '600'}`}>Vegan Meal Prep</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } transition-colors`}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;