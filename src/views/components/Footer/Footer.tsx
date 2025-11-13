import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src={logo} alt="Mirage TV" />
              <span>mirage</span>
            </Link>
            <div className="footer__socials">
              <a href="#" aria-label="Twitter">
                X
              </a>
              <a href="#" aria-label="Instagram">
                IG
              </a>
              <a href="#" aria-label="TikTok">
                TT
              </a>
              <a href="#" aria-label="Pinterest">
                P
              </a>
            </div>
          </div>
          <div className="footer__links">
            <div className="footer__links-group">
              <h3>Browse Categories</h3>
              <Link to="/browse/shows">TV Series</Link>
              <Link to="/browse/movies">Movies</Link>
              <Link to="/browse/shows">Original Shows</Link>
              <Link to="/browse/category/documentary">Documentary</Link>
            </div>
            <div className="footer__links-group">
              <h3>Help</h3>
              <Link to="/about">About Us</Link>
              <Link to="/pricing">Pricing/Plan</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/account">Account & Billing</Link>
            </div>
          </div>
          <div className="footer__app-stores">
            <h3>Download The App</h3>
            <a href="#" className="store-btn">
              <img src="/google-play.png" alt="Get it on Google Play" />
            </a>
            <a href="#" className="store-btn">
              <img src="/app-store.png" alt="Download on the App Store" />
            </a>
            <h3>Install on your TV</h3>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© Mirage 2023 - All rights reserved</p>
          <div className="footer__legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/legals">Legals</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
