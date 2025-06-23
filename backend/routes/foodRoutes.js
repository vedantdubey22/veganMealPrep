const express = require('express');
const router = express.Router();

// Mock food database (replace with real database later)
const foods = [
  {
    id: 1,
    name: 'Tofu',
    calories: 144,
    protein: 15.5,
    carbs: 3.5,
    fat: 8.7,
    servingSize: '100g',
    vegan: true
  },
  {
    id: 2,
    name: 'Quinoa',
    calories: 120,
    protein: 4.4,
    carbs: 21.3,
    fat: 1.9,
    servingSize: '100g',
    vegan: true
  },
  {
    id: 3,
    name: 'Chickpeas',
    calories: 164,
    protein: 8.9,
    carbs: 27.4,
    fat: 2.6,
    servingSize: '100g',
    vegan: true
  },
  {
    id: 4,
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g',
    vegan: false
  }
];

// Search foods
router.get('/search', (req, res) => {
  const { query } = req.query;
  
  // Filter only vegan foods first
  const veganFoods = foods.filter(food => food.vegan === true);
  
  if (!query) {
    return res.json(veganFoods);
  }

  const searchResults = veganFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );

  res.json(searchResults);
});

// Get food by ID
router.get('/:id', (req, res) => {
  const food = foods.find(f => f.id === parseInt(req.params.id));
  
  if (!food) {
    return res.status(404).json({ message: 'Food not found' });
  }

  // Only return if the food is vegan
  if (!food.vegan) {
    return res.status(404).json({ message: 'Food not found or not vegan' });
  }

  res.json(food);
});

module.exports = router; 