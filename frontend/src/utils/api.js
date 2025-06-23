import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for logging
api.interceptors.request.use((config) => {
  console.log('Making request:', {
    url: config.url,
    method: config.method,
    params: config.params,
    headers: config.headers,
  });
  return config;
}, (error) => {
  console.error('Request setup error:', error);
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Received response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      // Enhance error message based on status code
      const errorMessage = error.response.data?.message || 
        (error.response.status === 404 ? 'Resource not found' :
         error.response.status === 401 ? 'Unauthorized access' :
         error.response.status === 403 ? 'Access forbidden' :
         error.response.status === 400 ? 'Invalid request' :
         'An error occurred while processing your request');
      
      error.userMessage = errorMessage;
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error - No response received:', error.request);
      error.userMessage = 'Network error. Please check your connection and try again.';
    } else {
      // Error in request setup
      console.error('Request Setup Error:', error.message);
      error.userMessage = 'Failed to make request. Please try again.';
    }
    return Promise.reject(error);
  }
);

export const searchFood = async (query) => {
  try {
    console.log('Searching for food with query:', query);
    const response = await api.get('/food/search', {
      params: { query },
    });
    console.log('Search response:', response.data);
    return response.data || [];
  } catch (error) {
    console.error('Error in searchFood:', error);
    throw error;
  }
};

export const getNutritionInfo = async (foodId) => {
  try {
    console.log('Getting nutrition info for food ID:', foodId);
    const response = await api.get(`/food/nutrition/${foodId}`);
    console.log('Nutrition response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};

export const calculateRequirements = async (formData) => {
  try {
    console.log('Calculating requirements with data:', formData);
    const response = await api.post('/calculator/calculate', formData);
    console.log('Calculator response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calculating requirements:', error);
    throw error;
  }
};

export const saveUserRequirements = async (userData) => {
  try {
    console.log('Saving user requirements:', userData);
    const response = await api.post('/users/requirements', userData);
    console.log('Save requirements response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving user requirements:', error);
    throw error;
  }
};

export const saveMeal = async (mealData) => {
  try {
    const response = await api.post('/meals', mealData);
    return response.data;
  } catch (error) {
    console.error('Error in saveMeal:', error);
    throw error;
  }
};

export const getDailyMeals = async (date) => {
  try {
    const response = await api.get('/meals/daily', {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getDailyMeals:', error);
    throw error;
  }
};

export default api; 