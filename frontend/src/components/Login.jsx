import React, { useState } from 'react';
import GoogleLogin from './GoogleLogin';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem('token', response.data.token);
      if (onLoginSuccess) onLoginSuccess(response.data);
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Network Error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem('token', 'guest');
    if (onLoginSuccess) onLoginSuccess({ guest: true });
    else navigate('/');
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center mt-8 mb-12">
        <h1 className="text-6xl sm:text-7xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent mb-4" style={{lineHeight: 1.1}}>
          Your Personal Vegan<br />Assistant
        </h1>
        <p className="text-lg sm:text-xl text-center text-gray-400 max-w-2xl mx-auto">
          Track meals, calculate nutrition, and maintain a healthy vegan lifestyle with AI-powered recommendations.
        </p>
      </div>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors`}>
        <h2 className={`text-3xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h2>
        <p className={`mb-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sign in to continue your vegan journey</p>
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full p-3 rounded-md border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-200 text-gray-900'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              required
            />
          </div>
          <div>
            <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full p-3 rounded-md border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-200 text-gray-900'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold text-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md hover:from-pink-600 hover:to-purple-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && (
            <div className="w-full bg-red-900/60 border border-red-700 text-red-300 text-center py-2 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className={`mx-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Or continue with</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <GoogleLogin onSuccess={onLoginSuccess} />
        <button
          onClick={handleGuestLogin}
          className={`w-full mt-6 py-3 rounded-md font-semibold text-lg ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
        >
          Continue as Guest
        </button>
        <div className="text-center mt-6">
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Don't have an account? </span>
          <Link to="/signup" className="text-pink-500 font-semibold hover:underline">Sign up</Link>
        </div>
      </div>
      {/* Features Section at the bottom */}
      <div className="w-full max-w-6xl mx-auto mt-16 mb-8">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg flex flex-col items-center`}>
            <div className="text-pink-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Calorie Calculator</h3>
            <p className="text-gray-400 text-center">Calculate your daily caloric needs based on your personal metrics and activity level.</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg flex flex-col items-center`}>
            <div className="text-purple-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Personalized Tracking</h3>
            <p className="text-gray-400 text-center">Track your daily meals and monitor your progress with detailed nutritional information.</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg flex flex-col items-center`}>
            <div className="text-indigo-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Progress Analytics</h3>
            <p className="text-gray-400 text-center">View detailed analytics of your nutrition journey with easy-to-understand visualizations.</p>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-8">Join thousands of users who have transformed their vegan lifestyle with our app</p>
      </div>
    </div>
  );
};

export default Login; 