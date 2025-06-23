import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = ({ onSignUpSuccess }) => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        { email, password },
        { withCredentials: true }
      );
      setSuccess(true);
      if (onSignUpSuccess) onSignUpSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Network Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors`}>
        <h2 className={`text-3xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-6">
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
          <div>
            <label className={`block mb-1 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`w-full p-3 rounded-md border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-200 text-gray-900'} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold text-lg bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md hover:from-green-600 hover:to-teal-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {error && (
            <div className="w-full bg-red-900/60 border border-red-700 text-red-300 text-center py-2 rounded-md mt-2">
              {error}
            </div>
          )}
          {success && (
            <div className="w-full bg-green-900/60 border border-green-700 text-green-300 text-center py-2 rounded-md mt-2">
              Account created! You can now log in.
              <button
                type="button"
                className="w-full mt-4 py-2 rounded-md font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:from-blue-600 hover:to-indigo-600 transition-colors"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          )}
        </form>
        <div className="text-center mt-6">
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Already have an account? </span>
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 