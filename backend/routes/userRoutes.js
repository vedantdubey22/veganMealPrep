const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or update user with requirements
router.post('/requirements', async (req, res) => {
  try {
    const { gender, age, heightCm, weightKg, activityLevel, requirements } = req.body;
    
    // Create new user with requirements
    const user = new User({
      gender,
      age,
      heightCm,
      weightKg,
      activityLevel,
      requirements
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add food to user's selected foods
router.post('/:userId/foods', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { food } = req.body;
    user.selectedFoods.push(food);
    
    // Update remaining calories and macros
    user.requirements.remainingCalories -= food.calories;
    user.requirements.macros.remainingCarbs -= food.carbs;
    user.requirements.macros.remainingProtein -= food.protein;
    user.requirements.macros.remainingFat -= food.fat;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove food from user's selected foods
router.delete('/:userId/foods/:foodIndex', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const foodIndex = parseInt(req.params.foodIndex);
    const removedFood = user.selectedFoods[foodIndex];
    
    // Update remaining calories and macros
    user.requirements.remainingCalories += removedFood.calories;
    user.requirements.macros.remainingCarbs += removedFood.carbs;
    user.requirements.macros.remainingProtein += removedFood.protein;
    user.requirements.macros.remainingFat += removedFood.fat;

    user.selectedFoods.splice(foodIndex, 1);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user details with requirements and selected foods
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 