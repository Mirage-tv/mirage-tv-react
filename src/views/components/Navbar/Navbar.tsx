/**
 * Navbar Component
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import "./Navbar.css";
import type { NavbarProps } from "./Navbar.model";

export const Navbar = ({ className }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest(".navbar__user-menu")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setShowUserMenu(false);
      navigate("/");
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${className || ""}`}>
      <div className="container">
        <div className="navbar__container">
          <Link to="/" className="navbar__logo">
            🎬 Mirage
          </Link>

          <ul className="navbar__menu">
            <li>
              <Link to="/" className="navbar__link navbar__link--active">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/browse/shows" className="navbar__link">
                Originaux
              </Link>
            </li>
            <li>
              <Link to="/browse/movies" className="navbar__link">
                Films
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/my-list" className="navbar__link">
                  Ma Liste
                </Link>
              </li>
            )}
          </ul>

          <div className="navbar__actions">
            {isAuthenticated ? (
              <div className="navbar__user-menu">
                <button className="navbar__user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <span className="navbar__user-avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                  <span className="navbar__user-name">{user?.name}</span>
                  <span className={`navbar__user-arrow ${showUserMenu ? "navbar__user-arrow--open" : ""}`}>▼</span>
                </button>

                {showUserMenu && (
                  <div className="navbar__dropdown">
                    <button
                      className="navbar__dropdown-item"
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                    >
                      👤 Mon Profil
                    </button>
                    <button
                      className="navbar__dropdown-item"
                      onClick={() => {
                        navigate("/subscription");
                        setShowUserMenu(false);
                      }}
                    >
                      💳 Abonnement
                    </button>
                    <button
                      className="navbar__dropdown-item"
                      onClick={() => {
                        navigate("/my-list");
                        setShowUserMenu(false);
                      }}
                    >
                      ❤️ Ma Liste
                    </button>
                    <hr className="navbar__dropdown-divider" />
                    <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={handleLogout}>
                      🚪 Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn--primary" onClick={() => navigate("/login")}>
                Connexion
              </button>
            )}
          </div>

          <button className="navbar__toggle">☰</button>
        </div>
      </div>
    </nav>
  );
};
