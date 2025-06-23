import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const NutritionContext = createContext(null);

// Provider component
export const NutritionProvider = ({ children }) => {
  // Initialize state with localStorage value if available
  const [userRequirements, setUserRequirements] = useState(() => {
    try {
      const savedRequirements = localStorage.getItem('userRequirements');
      return savedRequirements ? JSON.parse(savedRequirements) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  });

  // Save to localStorage whenever requirements change
  useEffect(() => {
    try {
      if (userRequirements) {
        localStorage.setItem('userRequirements', JSON.stringify(userRequirements));
      } else {
        localStorage.removeItem('userRequirements');
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [userRequirements]);

  // Function to update requirements
  const updateUserRequirements = (requirements) => {
    if (!requirements) {
      console.error('Invalid requirements provided to updateUserRequirements');
      return;
    }
    setUserRequirements(requirements);
  };

  // Function to clear requirements
  const clearUserRequirements = () => {
    setUserRequirements(null);
    try {
      localStorage.removeItem('userRequirements');
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  };

  // Selected foods state and handlers
  const [selectedFoods, setSelectedFoods] = useState(() => {
    try {
      const savedFoods = localStorage.getItem('selectedFoods');
      return savedFoods ? JSON.parse(savedFoods) : [];
    } catch (error) {
      console.error('Error reading selectedFoods from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('selectedFoods', JSON.stringify(selectedFoods));
    } catch (error) {
      console.error('Error writing selectedFoods to localStorage:', error);
    }
  }, [selectedFoods]);

  const addFood = (food) => {
    if (!food) return;
    setSelectedFoods(prev => [...prev, food]);
  };

  const removeFood = (foodId) => {
    if (!foodId) return;
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId));
  };

  // Create the context value object
  const contextValue = {
    userRequirements,
    updateUserRequirements,
    clearUserRequirements,
    selectedFoods,
    addFood,
    removeFood
  };

  return (
    <NutritionContext.Provider value={contextValue}>
      {children}
    </NutritionContext.Provider>
  );
};

// Custom hook to use the nutrition context
export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === null) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}; 