import React from 'react';
import { useNutrition } from '../context/NutritionContext';

const RequirementsPanel = () => {
  const { userRequirements, selectedFoods } = useNutrition();

  if (!userRequirements) {
    return null;
  }

  // Calculate total nutrition from selected foods
  const totalNutrition = selectedFoods.reduce((acc, food) => ({
    calories: acc.calories + (food.nutrition?.calories || 0),
    protein: acc.protein + (food.nutrition?.protein || 0),
    carbs: acc.carbs + (food.nutrition?.carbs || 0),
    fat: acc.fat + (food.nutrition?.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const formatValue = (value) => value.toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Energy Summary</h2>
        <div className="flex justify-between items-center gap-4">
          {/* Consumed Circle */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(totalNutrition.calories)}</div>
                <div className="text-sm text-gray-500">kcal</div>
              </div>
            </div>
            <div className="mt-2 text-sm">Consumed</div>
          </div>

          {/* Target Circle */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-8 border-teal-500 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(userRequirements.dailyCalories)}</div>
                <div className="text-sm text-gray-500">kcal</div>
              </div>
            </div>
            <div className="mt-2 text-sm">Target</div>
          </div>

          {/* Remaining Circle */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-8 border-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(userRequirements.dailyCalories - totalNutrition.calories)}
                </div>
                <div className="text-sm text-gray-500">kcal</div>
              </div>
            </div>
            <div className="mt-2 text-sm">Remaining</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Targets</h2>
          <h2 className="text-xl font-semibold">CONSUMED</h2>
        </div>

        {/* Energy Row */}
        <div className="flex items-center justify-between">
          <div className="font-medium">Energy</div>
          <div className="flex items-center gap-2">
            <span>{formatValue(totalNutrition.calories)} / {Math.round(userRequirements.dailyCalories)} kcal</span>
            <span className="text-gray-500">{Math.round((totalNutrition.calories / userRequirements.dailyCalories) * 100)}%</span>
          </div>
        </div>

        {/* Protein Row */}
        <div className="flex items-center justify-between">
          <div className="font-medium">Protein</div>
          <div className="flex items-center gap-2">
            <span>{formatValue(totalNutrition.protein)} / {formatValue(userRequirements.macros.proteinGrams)} g</span>
            <span className="text-gray-500">{Math.round((totalNutrition.protein / userRequirements.macros.proteinGrams) * 100)}%</span>
          </div>
        </div>

        {/* Net Carbs Row */}
        <div className="flex items-center justify-between">
          <div className="font-medium">Net Carbs</div>
          <div className="flex items-center gap-2">
            <span>{formatValue(totalNutrition.carbs)} / {formatValue(userRequirements.macros.carbsGrams)} g</span>
            <span className="text-gray-500">{Math.round((totalNutrition.carbs / userRequirements.macros.carbsGrams) * 100)}%</span>
          </div>
        </div>

        {/* Fat Row */}
        <div className="flex items-center justify-between">
          <div className="font-medium">Fat</div>
          <div className="flex items-center gap-2">
            <span>{formatValue(totalNutrition.fat)} / {formatValue(userRequirements.macros.fatGrams)} g</span>
            <span className="text-gray-500">{Math.round((totalNutrition.fat / userRequirements.macros.fatGrams) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementsPanel; 