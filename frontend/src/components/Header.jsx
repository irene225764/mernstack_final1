export default function Header({ activeView, onHome, onAdd }) {
  return (
    <header className="site-header">
      <div className="header-inner page-width">
        <button className="brand" onClick={onHome} aria-label="My Recipe Book home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="brand-name">My Recipe <em>Book</em></span>
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={activeView === 'home' ? 'nav-link active' : 'nav-link'} onClick={onHome}>Home</button>
          <button className={activeView === 'form' ? 'nav-link active' : 'nav-link'} onClick={onAdd}>Add Recipe</button>
        </nav>
      </div>
    </header>
  );
}