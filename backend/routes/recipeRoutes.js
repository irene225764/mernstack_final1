const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');

const router = express.Router();
const recipeFields = ['name', 'category', 'ingredients', 'preparationSteps', 'cookingTime'];

function validateId(id, response) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).json({ message: 'The recipe ID is not valid.' });
    return false;
  }
  return true;
}

function validateCompleteRecipe(body, response) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    response.status(400).json({ message: 'Provide recipe details as a JSON object.' });
    return false;
  }

  const missingFields = recipeFields.filter((field) => body[field] === undefined || body[field] === null);
  if (missingFields.length) {
    response.status(400).json({
      message: `Complete all recipe fields: ${missingFields.join(', ')}.`,
    });
    return false;
  }
  return true;
}

router.get('/', async (request, response, next) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    response.json(recipes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  try {
    if (!validateId(request.params.id, response)) return;
    const recipe = await Recipe.findById(request.params.id);
    if (!recipe) {
      response.status(404).json({ message: 'Recipe not found.' });
      return;
    }
    response.json(recipe);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    if (!validateCompleteRecipe(request.body, response)) return;
    const recipe = await Recipe.create(request.body);
    response.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (request, response, next) => {
  try {
    if (!validateId(request.params.id, response)) return;
    if (!validateCompleteRecipe(request.body, response)) return;

    const recipe = await Recipe.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      response.status(404).json({ message: 'Recipe not found.' });
      return;
    }
    response.json(recipe);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (request, response, next) => {
  try {
    if (!validateId(request.params.id, response)) return;
    const recipe = await Recipe.findByIdAndDelete(request.params.id);
    if (!recipe) {
      response.status(404).json({ message: 'Recipe not found.' });
      return;
    }
    response.json({ message: 'Recipe deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;