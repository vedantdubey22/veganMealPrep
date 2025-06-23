import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLogin = ({ onSuccess }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        // Send to our backend
        const backendResponse = await axios.post(
          'http://localhost:5000/api/auth/google',
          {
            email: userInfo.data.email,
            name: userInfo.data.name,
            picture: userInfo.data.picture,
            googleId: userInfo.data.sub,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        // Store the token
        localStorage.setItem('token', backendResponse.data.token);
        
        // Call the success callback
        if (onSuccess) {
          onSuccess(backendResponse.data);
        }
      } catch (error) {
        console.error('Error during Google login:', error);
        setError(error.response?.data?.error || error.message || 'Failed to login with Google');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      setError('Failed to login with Google. Please try again.');
      setIsLoading(false);
    },
    flow: 'implicit',
    scope: 'email profile',
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => login()}
        disabled={isLoading}
        className={`
          bg-white text-gray-700 px-4 py-2 rounded-md shadow-sm 
          flex items-center space-x-2 hover:bg-gray-50 transition-colors
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="w-5 h-5"
        />
        <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
      </button>
      {error && (
        <div className="text-red-500 text-sm text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default GoogleLogin; 