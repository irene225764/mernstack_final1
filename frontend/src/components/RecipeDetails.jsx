import { useEffect, useRef } from 'react';

export default function RecipeDetails({ recipe, onClose }) {
  const closeButton = useRef(null);
  const dialog = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeButton.current?.focus();
    return () => previousFocus?.focus();
  }, []);

  function handleDialogKeyDown(event) {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = dialog.current.querySelectorAll('button:not([disabled])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="recipe-dialog" ref={dialog} onKeyDown={handleDialogKeyDown} role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="dialog-close" ref={closeButton} onClick={onClose} aria-label="Close recipe details">×</button>
        <p className="eyebrow">From your kitchen</p>
        <div className="detail-topline">
          <span className={`category-tag category-tag-${recipe.category.toLowerCase()}`}>{recipe.category}</span>
          <span className="time-indicator"><span aria-hidden="true">◷</span> {recipe.cookingTime} minutes</span>
        </div>
        <h2 id="detail-title">{recipe.name}</h2>
        <div className="detail-rule" />
        <div className="detail-columns">
          <section className="detail-section">
            <h3>Ingredients</h3>
            <p className="detail-copy ingredient-copy">{recipe.ingredients}</p>
          </section>
          <section className="detail-section">
            <h3>Preparation</h3>
            <p className="detail-copy steps-copy">{recipe.preparationSteps}</p>
          </section>
        </div>
      </section>
    </div>
  );
}