import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Notification from './components/Notification.jsx';
import RecipeDetails from './components/RecipeDetails.jsx';
import RecipeForm from './components/RecipeForm.jsx';
import RecipeList from './components/RecipeList.jsx';

const apiBaseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

async function requestApi(path, options = {}) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Could not reach the recipe server. Check that the backend is running and VITE_API_URL is correct.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || 'The request could not be completed.');
  }
  return result;
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [activeView, setActiveView] = useState('home');
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  async function loadRecipes() {
    setLoading(true);
    setFetchError('');
    try {
      const data = await requestApi('/recipes');
      setRecipes(data);
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  function showNotification(message, type = 'success') {
    setNotification({ message, type, id: Date.now() });
  }

  function openCreateForm() {
    setEditingRecipe(null);
    setActiveView('form');
  }

  function openEditForm(recipe) {
    setEditingRecipe(recipe);
    setSelectedRecipe(null);
    setActiveView('form');
  }

  async function saveRecipe(values) {
    setSaving(true);
    const isEditing = Boolean(editingRecipe);
    try {
      const savedRecipe = await requestApi(isEditing ? `/recipes/${editingRecipe._id}` : '/recipes', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(values),
      });

      setRecipes((currentRecipes) =>
        isEditing
          ? currentRecipes.map((recipe) => (recipe._id === savedRecipe._id ? savedRecipe : recipe))
          : [savedRecipe, ...currentRecipes]
      );
      setActiveView('home');
      setEditingRecipe(null);
      showNotification(isEditing ? 'Recipe changes saved.' : 'Recipe added to your collection.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecipe(recipe) {
    const confirmed = window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await requestApi(`/recipes/${recipe._id}`, { method: 'DELETE' });
      setRecipes((currentRecipes) => currentRecipes.filter((item) => item._id !== recipe._id));
      if (selectedRecipe?._id === recipe._id) setSelectedRecipe(null);
      showNotification('Recipe deleted.');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  }

  return (
    <div className="app-shell">
      <Header
        activeView={activeView}
        onHome={() => {
          setActiveView('home');
          setEditingRecipe(null);
        }}
        onAdd={openCreateForm}
      />

      <main>
        {activeView === 'home' ? (
          <>
            <section className="hero page-width" aria-labelledby="page-title">
              <div className="hero-copy">
                <p className="eyebrow"><span className="eyebrow-rule" /> A little place for what you love to cook</p>
                <h1 id="page-title">Your Kitchen,<br /><span>Your Collection</span></h1>
                <p className="hero-description">Keep your favourite flavours and family recipes in one place.</p>
                <button className="button button-primary hero-button" onClick={openCreateForm}>
                  <span aria-hidden="true">+</span> Add Recipe
                </button>
              </div>
              <div className="hero-illustration" aria-hidden="true">
                <div className="hero-sunburst" />
                <div className="hero-plate"><span className="plate-leaf leaf-one" /><span className="plate-leaf leaf-two" /><span className="plate-leaf leaf-three" /></div>
                <span className="hero-spark spark-one">✳</span>
                <span className="hero-spark spark-two">✳</span>
                <span className="hero-note">made with<br />a little love</span>
              </div>
            </section>

            <section className="collection-section page-width" aria-labelledby="collection-title">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">The good things</p>
                  <h2 id="collection-title">Your recipe shelf</h2>
                </div>
                {!loading && !fetchError && <span className="recipe-count">{recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}</span>}
              </div>
              <RecipeList
                recipes={recipes}
                loading={loading}
                error={fetchError}
                onRetry={loadRecipes}
                onView={setSelectedRecipe}
                onEdit={openEditForm}
                onDelete={deleteRecipe}
                onAdd={openCreateForm}
              />
            </section>
          </>
        ) : (
          <section className="form-page page-width" aria-labelledby="form-heading">
            <button className="back-link" onClick={() => setActiveView('home')}>
              <span aria-hidden="true">←</span> Back to your recipes
            </button>
            <RecipeForm
              key={editingRecipe?._id || 'new-recipe'}
              recipe={editingRecipe}
              saving={saving}
              onSubmit={saveRecipe}
              onCancel={() => {
                setActiveView('home');
                setEditingRecipe(null);
              }}
            />
          </section>
        )}
      </main>

      <footer className="site-footer page-width">
        <span className="footer-mark" aria-hidden="true">✳</span>
        <span>Made for the meals worth remembering.</span>
      </footer>

      {selectedRecipe && <RecipeDetails recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      {notification && <Notification key={notification.id} notification={notification} onClose={() => setNotification(null)} />}
    </div>
  );
}