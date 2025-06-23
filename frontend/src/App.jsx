import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import MealTracker from './components/MealTracker';
import Calculator from './components/Calculator';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from './context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';
import FoodSearch from './components/FoodSearch';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { saveMeal } from './utils/api';

function App() {
  const [dailyMeals, setDailyMeals] = useState([]);
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const { darkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeader = location.pathname === '/login' || location.pathname === '/signup';
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const updateNutritionTotals = (meals) => {
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.nutrition?.calories || 0),
      protein: acc.protein + (meal.nutrition?.protein || 0),
      carbs: acc.carbs + (meal.nutrition?.carbs || 0),
      fat: acc.fat + (meal.nutrition?.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    setNutritionTotals(totals);
  };

  const handleAddMeal = async (newMeal) => {
    try {
      await saveMeal(newMeal);
    } catch (error) {
      // Do not show error toast, just log
      console.error('Failed to save meal:', error);
    }
    const updatedMeals = [...dailyMeals, newMeal];
    setDailyMeals(updatedMeals);
    updateNutritionTotals(updatedMeals);
    toast.success('Added to daily foods');
  };

  const handleRemoveMeal = (mealIndex) => {
    const updatedMeals = dailyMeals.filter((_, index) => index !== mealIndex);
    setDailyMeals(updatedMeals);
    updateNutritionTotals(updatedMeals);
  };

  const handleLoginSuccess = (data) => {
    setIsLoggedIn(true);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? 'dark' : 'light'} />
      {!hideHeader && <Header />}
      {!hideHeader && (
        <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-200`}>
          <div className="container mx-auto px-4">
            <ul className="flex space-x-8 py-4">
              <li>
                <Link to="/food-search" className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} transition-colors`}>
                  Food Search
                </Link>
              </li>
              <li>
                <Link to="/calculator" className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} transition-colors`}>
                  BMI & Calorie Calculator
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      )}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div className="flex justify-center">
              <MealTracker 
                meals={dailyMeals}
                onAddMeal={handleAddMeal}
                onRemoveMeal={handleRemoveMeal}
              />
            </div>
          } />
          <Route path="/food-search" element={
            <div className="flex justify-center">
              <MealTracker 
                meals={dailyMeals}
                onAddMeal={handleAddMeal}
                onRemoveMeal={handleRemoveMeal}
              />
            </div>
          } />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 