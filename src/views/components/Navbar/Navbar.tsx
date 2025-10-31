/**
 * Navbar Component
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../infrastructure/store";
import "./Navbar.css";
import type { NavbarProps } from "./Navbar.model";

export const Navbar = ({ className }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { user, authenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              <Link to="/originals" className="navbar__link">
                Originaux
              </Link>
            </li>
            <li>
              <Link to="/movies" className="navbar__link">
                Films
              </Link>
            </li>
            <li>
              <Link to="/my-list" className="navbar__link">
                Ma Liste
              </Link>
            </li>
          </ul>

          <div className="navbar__actions">
            {authenticated ? (
              <button className="btn btn--ghost" onClick={() => navigate("/profile")}>
                {user?.name}
              </button>
            ) : (
              <button className="btn btn--primary" onClick={() => navigate("/signin")}>
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
