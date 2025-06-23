import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';
import { useTheme } from '../context/ThemeContext';

const Calculator = () => {
  const navigate = useNavigate();
  const { updateUserRequirements } = useNutrition();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    heightCm: '',
    weightKg: '',
    activityLevel: 'sedentary'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRequirements = (data) => {
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr;
    if (data.gender === 'male') {
      bmr = 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.age + 5;
    } else {
      bmr = 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.age - 161;
    }

    // Activity factor multipliers
    const activityFactors = {
      sedentary: 1.2,
      'lightly active': 1.375,
      'moderately active': 1.55,
      'very active': 1.725
    };

    const dailyCalories = bmr * activityFactors[data.activityLevel];
    const bmi = data.weightKg / Math.pow(data.heightCm / 100, 2);

    // Macronutrient calculations (adjusted for vegan diet)
    const protein = (dailyCalories * 0.3) / 4; // 30% of calories from protein
    const carbs = (dailyCalories * 0.4) / 4;   // 40% of calories from carbs
    const fat = (dailyCalories * 0.3) / 9;     // 30% of calories from fat

    return {
      dailyCalories,
      bmi,
      macros: {
        protein,
        carbs,
        fat
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const calculatedResults = calculateRequirements(formData);
      setResults(calculatedResults);
      
      // Save the requirements to context
      const requirements = {
        calories: Math.round(calculatedResults.dailyCalories),
        macros: {
          proteinGrams: Math.round(calculatedResults.macros.protein),
          carbsGrams: Math.round(calculatedResults.macros.carbs),
          fatGrams: Math.round(calculatedResults.macros.fat)
        }
      };
      
      updateUserRequirements(requirements);
    } catch (err) {
      console.error('Calculator error:', err);
      setError('Failed to calculate. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: darkMode ? 'text-yellow-400' : 'text-yellow-600' };
    if (bmi < 25) return { text: 'Normal weight', color: darkMode ? 'text-green-400' : 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: darkMode ? 'text-orange-400' : 'text-orange-600' };
    return { text: 'Obese', color: darkMode ? 'text-red-400' : 'text-red-600' };
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-green-50 to-white'} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden transition-colors duration-200`}>
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-10">
              <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-green-400' : 'text-green-800'} mb-3 transition-colors duration-200`}>
                Calculate Your Daily Requirements
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-200`}>
                Let's start by calculating your daily caloric and macro requirements.
                After this, you'll be able to search and track your food intake.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="relative">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-200`}>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full p-3 border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-900'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="relative">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-200`}>
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="1"
                      max="120"
                      className={`w-full p-3 border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-900'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-200`}>
                      Activity Level
                    </label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      className={`w-full p-3 border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-900'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly active">Lightly Active</option>
                      <option value="moderately active">Moderately Active</option>
                      <option value="very active">Very Active</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-200`}>
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="heightCm"
                      value={formData.heightCm}
                      onChange={handleChange}
                      min="1"
                      className={`w-full p-3 border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-900'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 transition-colors duration-200`}>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weightKg"
                      value={formData.weightKg}
                      onChange={handleChange}
                      min="1"
                      className={`w-full p-3 border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-200 text-gray-900'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r ${darkMode ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'} text-white py-4 px-6 rounded-xl transition-all disabled:opacity-50 text-lg font-semibold shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:-translate-y-0.5`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </span>
                  ) : 'Calculate Requirements'}
                </button>

                {results && (
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className={`flex-1 bg-gradient-to-r ${darkMode ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} text-white py-4 px-6 rounded-xl transition-all text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                  >
                    Continue to Food Search
                  </button>
                )}
              </div>
            </form>

            {error && (
              <div className={`mt-8 p-4 ${darkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-50 border-red-500'} border-l-4 rounded-r-lg transition-colors duration-200`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results && (
              <div className="mt-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-green-50 to-green-100'} rounded-2xl p-8 shadow-lg transition-colors duration-200`}>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-800'} mb-6`}>BMI Results</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Your BMI</span>
                        <span className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-800'}`}>{results.bmi.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Category</span>
                        <span className={`text-lg font-semibold ${getBMICategory(results.bmi).color}`}>
                          {getBMICategory(results.bmi).text}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-2xl p-8 shadow-lg transition-colors duration-200`}>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'} mb-6`}>Daily Calories</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Target Calories</span>
                        <span className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>{Math.round(results.dailyCalories)} kcal</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Maintenance Level</span>
                        <span className={`text-lg font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {results.dailyCalories > 2500 ? 'High' : results.dailyCalories > 1800 ? 'Moderate' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-purple-50 to-purple-100'} rounded-2xl p-8 shadow-lg transition-colors duration-200`}>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-800'} mb-6`}>Macro Distribution</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className={`text-center p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow transition-colors duration-200`}>
                      <h4 className={`text-lg font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-800'} mb-2`}>Protein</h4>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{Math.round(results.macros.protein)}g</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>30% of calories</p>
                    </div>
                    <div className={`text-center p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow transition-colors duration-200`}>
                      <h4 className={`text-lg font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-800'} mb-2`}>Carbs</h4>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{Math.round(results.macros.carbs)}g</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>40% of calories</p>
                    </div>
                    <div className={`text-center p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow transition-colors duration-200`}>
                      <h4 className={`text-lg font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-800'} mb-2`}>Fat</h4>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{Math.round(results.macros.fat)}g</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>30% of calories</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 