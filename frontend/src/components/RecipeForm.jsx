import { useState } from 'react';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

export default function RecipeForm({ recipe, saving, onSubmit, onCancel }) {
  const [formError, setFormError] = useState('');
  const [values, setValues] = useState({
    name: recipe?.name || '',
    category: recipe?.category || '',
    ingredients: recipe?.ingredients || '',
    preparationSteps: recipe?.preparationSteps || '',
    cookingTime: recipe?.cookingTime?.toString() || '',
  });

  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    const payload = {
      ...values,
      name: values.name.trim(),
      ingredients: values.ingredients.trim(),
      preparationSteps: values.preparationSteps.trim(),
      cookingTime: Number(values.cookingTime),
    };

    if (!payload.name || !payload.category || !payload.ingredients || !payload.preparationSteps) {
      setFormError('Please complete every field before saving.');
      return;
    }
    if (!Number.isInteger(payload.cookingTime) || payload.cookingTime < 1) {
      setFormError('Cooking time must be at least one whole minute.');
      return;
    }

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(error.message);
    }
  }

  return (
    <div className="recipe-form-wrap">
      <div className="form-heading">
        <p className="eyebrow">{recipe ? 'A recipe in the making' : 'Save something delicious'}</p>
        <h1 id="form-heading">{recipe ? 'Edit your recipe' : 'Add a recipe'}</h1>
        <p>Write it down, so the good ones never get lost.</p>
      </div>
      <form className="recipe-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label className="field field-wide" htmlFor="recipe-name">
            <span>Recipe name <b aria-hidden="true">*</b></span>
            <input id="recipe-name" name="name" value={values.name} onChange={updateField} maxLength="100" placeholder="e.g. Sunday tomato pasta" required />
          </label>
          <label className="field" htmlFor="recipe-category">
            <span>Category <b aria-hidden="true">*</b></span>
            <select id="recipe-category" name="category" value={values.category} onChange={updateField} required>
              <option value="" disabled>Choose a category</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label className="field" htmlFor="cooking-time">
            <span>Cooking time <b aria-hidden="true">*</b></span>
            <span className="input-with-unit">
              <input id="cooking-time" name="cookingTime" type="number" min="1" step="1" inputMode="numeric" value={values.cookingTime} onChange={updateField} placeholder="30" required />
              <span>min</span>
            </span>
          </label>
          <label className="field field-wide" htmlFor="ingredients">
            <span>Ingredients <b aria-hidden="true">*</b></span>
            <textarea id="ingredients" name="ingredients" rows="5" value={values.ingredients} onChange={updateField} maxLength="10000" placeholder={'One ingredient per line works beautifully.\n2 cups ripe tomatoes\nA generous pinch of salt'} required />
          </label>
          <label className="field field-wide" htmlFor="preparation-steps">
            <span>Preparation steps <b aria-hidden="true">*</b></span>
            <textarea id="preparation-steps" name="preparationSteps" rows="6" value={values.preparationSteps} onChange={updateField} maxLength="20000" placeholder={'Tell your future self how it goes.\n1. Warm the pan over medium heat.\n2. Add the tomatoes and let them soften.'} required />
          </label>
        </div>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <div className="form-actions">
          {recipe && <button className="button button-secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</button>}
          <button className="button button-primary" type="submit" disabled={saving}>
            {saving ? <><span className="button-spinner" aria-hidden="true" /> Saving…</> : recipe ? 'Save changes' : 'Save recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}