import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { searchFood, getNutritionInfo } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import ChatBot from './ChatBot';
import { useNutrition } from '../context/NutritionContext';

function MealTracker({ meals, onAddMeal, onRemoveMeal }) {
  const { darkMode } = useTheme();
  const { userRequirements } = useNutrition();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionSize, setPortionSize] = useState(100);
  const [portionSizeInput, setPortionSizeInput] = useState('100');
  const [loading, setLoading] = useState(false);

  const totalNutrition = meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.nutrition?.calories || 0),
    protein: acc.protein + (meal.nutrition?.protein || 0),
    carbs: acc.carbs + (meal.nutrition?.carbs || 0),
    fat: acc.fat + (meal.nutrition?.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const targetCalories = userRequirements?.calories || 2000;
  const targetProtein = userRequirements?.protein || 150;
  const targetCarbs = userRequirements?.carbs || 200;
  const targetFat = userRequirements?.fat || 67;

  // Calculate adjusted nutrition based on portion size
  const adjustedNutrition = selectedFood ? {
    calories: (selectedFood.nutrition?.calories || 0) * (portionSize / 100),
    protein: (selectedFood.nutrition?.protein || 0) * (portionSize / 100),
    carbs: (selectedFood.nutrition?.carbs || 0) * (portionSize / 100),
    fat: (selectedFood.nutrition?.fat || 0) * (portionSize / 100)
  } : null;

  const handlePortionChange = (e) => {
    const inputValue = e.target.value;
    setPortionSizeInput(inputValue);
    
    const value = parseInt(inputValue);
    if (!isNaN(value) && value > 0 && value <= 1000) {
      setPortionSize(value);
    } else if (inputValue === '') {
      setPortionSize(0);
    }
  };

  const handleSearch = async (query) => {
    if (!query || query.length < 2) {
      toast.info('Please enter at least 2 characters to search');
      setSearchResults([]);
      setSelectedFood(null);
      return;
    }

    setLoading(true);
    try {
      const results = await searchFood(query);
      if (results && results.length > 0) {
        setSearchResults(results);
        setSelectedFood(null);
      } else {
        setSearchResults([]);
        setSelectedFood(null);
        toast.info('No food items found. Try a different search term.');
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Error searching for food items');
        console.error('Search error:', error);
      }
      setSearchResults([]);
      setSelectedFood(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = async (food) => {
    setLoading(true);
    try {
      const nutritionInfo = await getNutritionInfo(food.id);
      setSelectedFood({
        ...food,
        nutrition: nutritionInfo
      });
    } catch (error) {
      toast.error('Error getting nutrition information');
      console.error('Nutrition info error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchTerm);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Energy Summary Section */}
        <div className="md:col-span-5">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Energy Summary</h2>
            
            <div className="flex justify-between items-center mb-8">
              {/* Consumed Circle */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-8 border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{Math.round(totalNutrition.calories)}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>kcal</div>
                  </div>
                </div>
                <div className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Consumed</div>
              </div>

              {/* Target Circle */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-8 border-green-500 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{targetCalories}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>kcal</div>
                  </div>
                </div>
                <div className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Target</div>
              </div>

              {/* Remaining Circle */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-8 border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{targetCalories - Math.round(totalNutrition.calories)}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>kcal</div>
                  </div>
                </div>
                <div className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Remaining</div>
              </div>
            </div>

            {/* Targets Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Targets</h3>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>CONSUMED</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Energy</span>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{Math.round(totalNutrition.calories)} / {targetCalories} kcal ({Math.round((totalNutrition.calories / targetCalories) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Protein</span>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{Math.round(totalNutrition.protein)} / {targetProtein} g ({Math.round((totalNutrition.protein / targetProtein) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Net Carbs</span>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{Math.round(totalNutrition.carbs)} / {targetCarbs} g ({Math.round((totalNutrition.carbs / targetCarbs) * 100)}%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>Fat</span>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{Math.round(totalNutrition.fat)} / {targetFat} g ({Math.round((totalNutrition.fat / targetFat) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Vegan Foods Section */}
        <div className="md:col-span-7">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h2 className="text-xl font-semibold text-green-700 mb-6">Search Vegan Foods</h2>
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for vegan foods..."
                  className={`flex-1 px-4 py-2 border-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-green-500 text-gray-900'
                  } rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
                <button
                  onClick={() => handleSearch(searchTerm)}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Added Foods List - moved here */}
            <div className={`w-full max-w-2xl mx-auto mb-8 ${darkMode ? 'bg-gray-900' : 'bg-green-50'} rounded-lg p-4 shadow`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>Your Daily Foods</h3>
              {meals.length > 0 ? (
                <div className="space-y-2">
                  {meals.map((food, idx) => (
                    <div key={food.id || idx} className={`flex items-center justify-between p-3 border rounded-md ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}` }>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{food.name} ({food.portionSize || 100}g)</h3>
                        {food.nutrition && (
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {Math.round(food.nutrition.calories)} cal |
                            P: {Math.round(food.nutrition.protein)}g |
                            C: {Math.round(food.nutrition.carbs)}g |
                            F: {Math.round(food.nutrition.fat)}g
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveMeal(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-gray-500 ${darkMode ? 'text-gray-400' : ''}`}>No foods added yet.</div>
              )}
            </div>

            {!selectedFood && searchResults.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
                    onClick={() => handleSelectFood(food)}
                  >
                    <span className="text-gray-800">{food.name}</span>
                    <span className="text-sm text-gray-500">Select →</span>
                  </div>
                ))}
              </div>
            )}

            {selectedFood && (
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-6`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-green-800'}`}>{selectedFood.name}</h3>
                  <button 
                    className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'}`}
                    onClick={() => {
                      setSelectedFood(null);
                      setPortionSize(100);
                      setPortionSizeInput('100');
                    }}
                  >
                    Back to results
                  </button>
                </div>

                {/* Portion Size Input */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Portion Size (grams)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="1"
                      max="1000"
                      value={portionSizeInput}
                      onChange={handlePortionChange}
                      className={`w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-600 border-gray-500 text-gray-200' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Amount"
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>grams</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {Math.round(adjustedNutrition?.protein || 0)}g
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Protein</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {Math.round(adjustedNutrition?.carbs || 0)}g
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {Math.round(adjustedNutrition?.fat || 0)}g
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fat</div>
                  </div>
                </div>

                <div className={`text-center text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Nutrition values for {portionSize}g serving
                </div>

                <button
                  onClick={async () => {
                    if (portionSize <= 0) {
                      toast.error('Please enter a valid portion size (1-1000g)');
                      return;
                    }
                    await onAddMeal({
                      ...selectedFood,
                      portionSize,
                      nutrition: adjustedNutrition
                    });
                    setSelectedFood(null);
                    setSearchResults([]);
                    setSearchTerm('');
                    setPortionSize(100);
                    setPortionSizeInput('100');
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Daily Foods
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}

export default MealTracker; 