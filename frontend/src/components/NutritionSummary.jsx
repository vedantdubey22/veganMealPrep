import React from 'react';
import {
  ChartBarIcon,
  FireIcon,
  BeakerIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

function NutritionSummary({ totals }) {
  const { darkMode } = useTheme();

  const nutritionItems = [
    {
      label: 'Calories',
      value: Math.round(totals.calories),
      unit: 'kcal',
      icon: FireIcon,
      color: darkMode ? 'text-orange-400' : 'text-orange-600',
      bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-100'
    },
    {
      label: 'Protein',
      value: Math.round(totals.protein),
      unit: 'g',
      icon: ChartBarIcon,
      color: darkMode ? 'text-blue-400' : 'text-blue-600',
      bgColor: darkMode ? 'bg-blue-900/20' : 'bg-blue-100'
    },
    {
      label: 'Carbs',
      value: Math.round(totals.carbs),
      unit: 'g',
      icon: BeakerIcon,
      color: darkMode ? 'text-green-400' : 'text-green-600',
      bgColor: darkMode ? 'bg-green-900/20' : 'bg-green-100'
    },
    {
      label: 'Fat',
      value: Math.round(totals.fat),
      unit: 'g',
      icon: ScaleIcon,
      color: darkMode ? 'text-purple-400' : 'text-purple-600',
      bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-100'
    }
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 transition-colors duration-200`}>
      <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Daily Nutrition Summary</h2>
      
      <div className="space-y-4">
        {nutritionItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center p-4 rounded-lg border ${
                darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200'
              } transition-colors duration-200`}
            >
              <div className={`p-3 rounded-full ${item.bgColor} mr-4 transition-colors duration-200`}>
                <Icon className={`h-6 w-6 ${item.color} transition-colors duration-200`} />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors duration-200`}>{item.label}</p>
                <p className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'} transition-colors duration-200`}>
                  {item.value}
                  <span className={`text-sm font-normal ${darkMode ? 'text-gray-400' : 'text-gray-600'} ml-1 transition-colors duration-200`}>
                    {item.unit}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-6 p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-primary-50'} rounded-lg transition-colors duration-200`}>
        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-primary-800'} mb-2 transition-colors duration-200`}>
          Daily Goals
        </h3>
        <div className="space-y-2">
          <div className={`h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full transition-colors duration-200`}>
            <div
              className={`h-2 ${darkMode ? 'bg-green-500' : 'bg-primary-600'} rounded-full transition-colors duration-200`}
              style={{
                width: `${Math.min((totals.calories / 2000) * 100, 100)}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{Math.round((totals.calories / 2000) * 100)}% of daily goal</span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>2000 kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionSummary; 