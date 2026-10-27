const mongoose = require('mongoose');

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required.'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Choose a recipe category.'],
      enum: {
        values: categories,
        message: 'Choose a valid recipe category.',
      },
    },
    ingredients: {
      type: String,
      required: [true, 'Ingredients are required.'],
      trim: true,
    },
    preparationSteps: {
      type: String,
      required: [true, 'Preparation steps are required.'],
      trim: true,
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required.'],
      min: [1, 'Cooking time must be at least one minute.'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);