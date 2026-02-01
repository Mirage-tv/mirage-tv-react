import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { useAuth } from '../../../core/hooks';
import './Navbar.css';
import type { NavbarProps } from './Navbar.model';

const NavLink = ({ to, label, currentPath }: { to: string; label: string; currentPath: string }) => {
  const isActive = currentPath === to;
  return (
    <li>
      <Link to={to} className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
        {label}
      </Link>
    </li>
  );
};

export const Navbar = ({ className }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isSubscriber } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${className || ''}`}>
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          <img src={logo} alt="Mirage TV Logo" />
          {/*<span>mirage</span>*/}
        </Link>
      </div>

      <nav className="navbar__center">
        <ul className="navbar__menu">
          <NavLink to="/" label="ACCUEIL" currentPath={location.pathname} />
          <NavLink to="/browse/shows" label="SÉRIES" currentPath={location.pathname} />
          <NavLink to="/browse/movies" label="FILMS" currentPath={location.pathname} />
          {isAuthenticated && isSubscriber && <NavLink to="/my-list" label="FAVORIS" currentPath={location.pathname} />}
          <li>
            <button className="navbar__search-btn-inline" onClick={() => navigate('/search')} aria-label="Rechercher">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </li>
        </ul>
      </nav>

      <div className="navbar__right">
        {/* Bouton S'abonner pour les utilisateurs non connectés ou sans abonnement */}
        {(!isAuthenticated || !isSubscriber) && (
          <button className="navbar__subscribe-btn" onClick={() => navigate('/subscribe')}>
            S'abonner
          </button>
        )}

        {isAuthenticated ? (
          <div className="navbar__user-menu">
            <button className="navbar__action-btn navbar__user-avatar" onClick={() => navigate('/profile')}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            {/* Le dropdown peut être ré-implémenté ici si nécessaire */}
          </div>
        ) : (
          <button className="navbar__login-btn" onClick={() => navigate('/login')}>
            Connexion
          </button>
        )}
      </div>
    </header>
  );
};
