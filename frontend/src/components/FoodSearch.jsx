import React, { useState, useEffect } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { searchFood, getNutritionInfo } from '../utils/api';
import RequirementsPanel from './RequirementsPanel';
import ChatBot from './ChatBot';

const FoodSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portionSize, setPortionSize] = useState(100); // Default to 100g
  const [tempPortionSize, setTempPortionSize] = useState('100'); // For handling input state
  const { selectedFoods, addFood, removeFood, userRequirements } = useNutrition();

  // Reset tempPortionSize when selectedFood changes
  useEffect(() => {
    if (selectedFood) {
      setTempPortionSize(portionSize.toString());
    }
  }, [selectedFood, portionSize]);

  // Handle portion size changes
  const handlePortionChange = (e) => {
    const value = e.target.value;
    setTempPortionSize(value); // Allow any input while typing
    
    // Only update the actual portion size if the value is valid
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1000) {
      setPortionSize(numValue);
    }
  };

  // Validate on blur
  const handlePortionBlur = () => {
    if (tempPortionSize === '' || parseInt(tempPortionSize) === 0) {
      setTempPortionSize('1');
      setPortionSize(1);
    } else {
      const numValue = Math.min(1000, Math.max(1, parseInt(tempPortionSize) || 1));
      setTempPortionSize(numValue.toString());
      setPortionSize(numValue);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedFood(null);

    try {
      const results = await searchFood(searchTerm);
      // Filter out any non-vegan items that might slip through
      const nonVeganKeywords = [
        // Meats
        'chicken', 'beef', 'pork', 'fish', 'meat', 'lamb', 'mutton', 'veal', 'turkey', 'duck',
        'bacon', 'ham', 'sausage', 'seafood', 'shrimp', 'prawn', 'crab', 'lobster', 'shellfish',
        'tuna', 'salmon', 'cod', 'halibut', 'tilapia', 'anchovy', 'sardine',
        // Dairy
        'egg', 'dairy', 'milk', 'cheese', 'yogurt', 'cream', 'butter', 'whey', 'casein',
        'lactose', 'ghee', 'custard', 'ice cream', 'gelato',
        // Other Animal Products
        'honey', 'gelatin', 'lard', 'tallow', 'bone', 'stock', 'broth'
      ];

      const veganResults = results.filter(food => {
        const foodNameLower = food.name.toLowerCase();
        // Check if the food name contains any non-vegan keywords
        const containsNonVegan = nonVeganKeywords.some(keyword => 
          foodNameLower.includes(keyword.toLowerCase())
        );
        
        // Additional check for compound words (e.g., "lamb chop", "beef stew")
        const containsCompoundNonVegan = nonVeganKeywords.some(keyword =>
          foodNameLower.split(' ').some(word => word === keyword.toLowerCase())
        );

        return !containsNonVegan && !containsCompoundNonVegan;
      });
      
      if (veganResults.length === 0 && results.length > 0) {
        setError('No vegan options found for your search. Please try a different term.');
      }
      setSearchResults(veganResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.userMessage || 'Failed to search foods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSelect = async (food) => {
    try {
      setLoading(true);
      setError(null);
      const nutritionInfo = await getNutritionInfo(food.id);
      
      // Extract nutrition values from the nutrients array
      const nutrition = {
        calories: nutritionInfo.calories || 0,
        protein: nutritionInfo.protein || 0,
        carbs: nutritionInfo.carbs || 0,
        fat: nutritionInfo.fat || 0
      };

      setSelectedFood({
        ...food,
        nutrition
      });
    } catch (err) {
      console.error('Error getting nutrition:', err);
      setError(err.userMessage || 'Failed to get nutrition info. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (food) => {
    try {
      const nutritionInfo = await getNutritionInfo(food.id);
      
      // Extract nutrition values from the nutrients array
      const nutrition = {
        calories: nutritionInfo.calories || 0,
        protein: nutritionInfo.protein || 0,
        carbs: nutritionInfo.carbs || 0,
        fat: nutritionInfo.fat || 0
      };

      // Calculate total calories consumed so far
      const totalCaloriesConsumed = selectedFoods.reduce((total, food) => 
        total + (food.nutrition?.calories || 0), 0);

      // Check if adding this food would make remaining calories negative
      const remainingCaloriesAfterAdd = userRequirements.dailyCalories - (totalCaloriesConsumed + nutrition.calories);
      if (remainingCaloriesAfterAdd < 0) {
        setError(`Adding this food would exceed your daily calorie target by ${Math.abs(Math.round(remainingCaloriesAfterAdd))} calories. Please choose a smaller portion or a different food.`);
        return;
      }

      addFood({ ...food, nutrition });
      setSelectedFood(null);
    } catch (err) {
      console.error('Error adding food:', err);
      setError(err.userMessage || 'Failed to add food. Please try again.');
    }
  };

  console.log('FoodSearch component rendered. selectedFoods:', selectedFoods);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* DEBUG: If you see this, FoodSearch is rendering! */}
      <div className="mb-4 p-4 bg-red-200 text-red-900 font-bold rounded">DEBUG: FoodSearch is rendering!</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Requirements Panel */}
        <div className="md:col-span-1">
          <RequirementsPanel />
        </div>

        {/* Search and Results */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Search Vegan Foods</h2>
            
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for vegan foods..."
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {/* Debug: Add Test Food Button */}
            <button
              onClick={() => addFood({ id: Date.now(), name: 'Test Food', nutrition: { calories: 100, protein: 5, carbs: 10, fat: 2 }, portionSize: 100 })}
              className="mb-4 bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
            >
              Add Test Food
            </button>

            {/* Selected Foods (always visible below search bar) */}
            {selectedFoods.length > 0 ? (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-green-800 mb-2">Your Daily Foods</h3>
                <div className="space-y-2">
                  {selectedFoods.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-green-50"
                    >
                      <div>
                        <h3 className="font-medium">{food.name} ({food.portionSize || 100}g)</h3>
                        {food.nutrition && (
                          <p className="text-sm text-gray-600">
                            {Math.round(food.nutrition.calories)} cal | 
                            P: {Math.round(food.nutrition.protein)}g | 
                            C: {Math.round(food.nutrition.carbs)}g | 
                            F: {Math.round(food.nutrition.fat)}g
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFood(food.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8 text-gray-500">No foods added yet.</div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Selected Food Details */}
            {selectedFood && (
              <div className="mb-6 p-6 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-green-800">{selectedFood.name}</h3>
                  <button
                    onClick={() => setSelectedFood(null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Back to results
                  </button>
                </div>

                {/* Portion size input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portion Size (grams)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={tempPortionSize}
                    onChange={handlePortionChange}
                    onBlur={handlePortionBlur}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-white rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-800">
                      {Math.round((selectedFood.nutrition?.protein || 0) * (portionSize / 100))}g
                    </div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-800">
                      {Math.round((selectedFood.nutrition?.carbs || 0) * (portionSize / 100))}g
                    </div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-800">
                      {Math.round((selectedFood.nutrition?.fat || 0) * (portionSize / 100))}g
                    </div>
                    <div className="text-sm text-gray-600">Fat</div>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-green-800">
                    {Math.round((selectedFood.nutrition?.calories || 0) * (portionSize / 100))} calories
                  </div>
                  <div className="text-sm text-gray-600">
                    for {portionSize}g serving
                  </div>
                </div>

                <button
                  onClick={() => {
                    const adjustedNutrition = {
                      calories: (selectedFood.nutrition?.calories || 0) * (portionSize / 100),
                      protein: (selectedFood.nutrition?.protein || 0) * (portionSize / 100),
                      carbs: (selectedFood.nutrition?.carbs || 0) * (portionSize / 100),
                      fat: (selectedFood.nutrition?.fat || 0) * (portionSize / 100)
                    };
                    handleAddFood({ ...selectedFood, nutrition: adjustedNutrition, portionSize });
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Daily Foods
                </button>
              </div>
            )}

            {/* Search Results */}
            {!selectedFood && (
              <div className="space-y-4">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleFoodSelect(food)}
                  >
                    <div>
                      <h3 className="font-medium">{food.name}</h3>
                      <p className="text-sm text-gray-600">Click to view nutrition details</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default FoodSearch; 