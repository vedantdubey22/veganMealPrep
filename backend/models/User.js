const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  age: {
    type: Number,
    required: true
  },
  heightCm: {
    type: Number,
    required: true
  },
  weightKg: {
    type: Number,
    required: true
  },
  activityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'lightly active', 'moderately active', 'very active']
  },
  requirements: {
    dailyCalories: Number,
    remainingCalories: Number,
    macros: {
      carbsGrams: Number,
      proteinGrams: Number,
      fatGrams: Number,
      remainingCarbs: Number,
      remainingProtein: Number,
      remainingFat: Number
    },
    bmi: Number
  },
  selectedFoods: [{
    name: String,
    calories: Number,
    carbs: Number,
    protein: Number,
    fat: Number,
    servingSize: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema); 