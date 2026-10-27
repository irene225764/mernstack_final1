export default function RecipeCard({ recipe, onView, onEdit, onDelete }) {
  return (
    <article className="recipe-card">
      <div className={`card-art category-${recipe.category.toLowerCase()}`} aria-hidden="true">
        <span className="card-art-index">IN YOUR COLLECTION</span>
        <span className="card-art-shape"><span /></span>
        <span className="card-art-sprig">✳</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className={`category-tag category-tag-${recipe.category.toLowerCase()}`}>{recipe.category}</span>
          <span className="time-indicator"><span aria-hidden="true">◷</span> {recipe.cookingTime} min</span>
        </div>
        <h3>{recipe.name}</h3>
        <button className="card-view" onClick={() => onView(recipe)} aria-label={`View details for ${recipe.name}`}>
          View recipe <span aria-hidden="true">↗</span>
        </button>
        <div className="card-actions" aria-label={`Actions for ${recipe.name}`}>
          <button type="button" onClick={() => onEdit(recipe)} aria-label={`Edit ${recipe.name}`} title="Edit recipe">Edit</button>
          <button type="button" onClick={() => onDelete(recipe)} aria-label={`Delete ${recipe.name}`} title="Delete recipe">Delete</button>
        </div>
      </div>
    </article>
  );
}