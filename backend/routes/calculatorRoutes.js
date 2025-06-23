const express = require('express');
const router = express.Router();

// Calculate BMI, daily calories, and macros
router.post('/calculate', (req, res) => {
  try {
    const { gender, age, heightCm, weightKg, activityLevel } = req.body;

    // Calculate BMI
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly active': 1.375,
      'moderately active': 1.55,
      'very active': 1.725
    };

    // Calculate daily calories
    const dailyCalories = bmr * activityMultipliers[activityLevel];

    // Calculate macros (40% carbs, 30% protein, 30% fat)
    const carbsCalories = dailyCalories * 0.4;
    const proteinCalories = dailyCalories * 0.3;
    const fatCalories = dailyCalories * 0.3;

    const macros = {
      carbsGrams: Math.round(carbsCalories / 4), // 4 calories per gram of carbs
      proteinGrams: Math.round(proteinCalories / 4), // 4 calories per gram of protein
      fatGrams: Math.round(fatCalories / 9) // 9 calories per gram of fat
    };

    res.json({
      bmi: parseFloat(bmi.toFixed(1)),
      dailyCalories: Math.round(dailyCalories),
      macros
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 