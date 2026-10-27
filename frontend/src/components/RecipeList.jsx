import RecipeCard from './RecipeCard.jsx';

export default function RecipeList({ recipes, loading, error, onRetry, onView, onEdit, onDelete, onAdd }) {
  if (loading) {
    return <div className="state-panel loading-state" role="status"><span className="loading-mark" /> Gathering your recipes…</div>;
  }

  if (error) {
    return (
      <div className="state-panel error-state" role="alert">
        <span className="state-symbol" aria-hidden="true">!</span>
        <div><h3>Your recipe shelf is out of reach</h3><p>{error}</p><button className="text-button" onClick={onRetry}>Try again <span aria-hidden="true">↻</span></button></div>
      </div>
    );
  }

  if (!recipes.length) {
    return (
      <div className="empty-state">
        <div className="empty-illustration" aria-hidden="true"><span className="empty-plate" /><span className="empty-herb">✳</span></div>
        <p className="eyebrow">A blank page, in the best way</p>
        <h3>Your recipes will feel at home here.</h3>
        <p>Start with the dish you make without even looking at the recipe.</p>
        <button className="button button-outline" onClick={onAdd}><span aria-hidden="true">+</span> Add your first recipe</button>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}