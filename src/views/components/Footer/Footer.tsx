import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";
import "./Footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* Brand Section */}
          <div className="footer__section footer__brand-section">
            <Link to="/" className="footer__logo">
              <img src={logo} alt="Mirage TV" />
              <span>mirage</span>
            </Link>
            <p className="footer__tagline">Your ultimate streaming destination for movies, shows, and exclusive content.</p>
            <div className="footer__socials">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="social-icon"
                title="Follow us on Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-3 1" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-icon"
                title="Follow us on Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                  <circle cx="17.5" cy="6.5" r="1.5"></circle>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social-icon"
                title="Subscribe on YouTube"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="social-icon"
                title="Follow us on TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.498 3.012h-3.58v12.408c0 1.577-.947 3.01-2.327 3.659-.627.329-1.326.515-2.068.515-1.577 0-2.922-.94-3.493-2.307-.283-.677-.436-1.429-.436-2.218 0-3.726 3.035-6.762 6.761-6.762.502 0 .99.056 1.46.167V4.41c-.496-.09-1.008-.144-1.528-.144-5.59 0-10.128 4.537-10.128 10.127 0 2.71 1.076 5.174 2.82 6.98 1.742 1.804 4.181 2.922 6.825 2.922 5.588 0 10.125-4.539 10.125-10.128V9.595c2.031 1.495 4.519 2.396 7.283 2.396v-3.58c-1.885 0-3.63-.744-4.906-1.955z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Browse Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Browse</h4>
            <ul className="footer__links-list">
              <li>
                <Link to="/browse/movies">Movies</Link>
              </li>
              <li>
                <Link to="/browse/shows">TV Series</Link>
              </li>
              <li>
                <Link to="/browse/category/original">Original Shows</Link>
              </li>
              <li>
                <Link to="/browse/category/documentary">Documentary</Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Support</h4>
            <ul className="footer__links-list">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/pricing">Pricing & Plans</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Account Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Account</h4>
            <ul className="footer__links-list">
              <li>
                <Link to="/account">Account Settings</Link>
              </li>
              <li>
                <Link to="/billing">Billing & Payments</Link>
              </li>
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/preferences">Preferences</Link>
              </li>
            </ul>
          </div>

          {/* Apps Section */}
          <div className="footer__section footer__apps">
            <h4 className="footer__section-title">Get the App</h4>
            <div className="footer__app-links">
              <a href="#" className="app-store-link google-play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13.5v8.25A1.5 1.5 0 004.5 23h15a1.5 1.5 0 001.5-1.5V13.5M1 5.25C1 4.006 2.006 3 3.25 3h17.5C21.994 3 23 4.006 23 5.25v13.5C23 19.994 21.994 21 20.75 21H3.25C2.006 21 1 19.994 1 18.75V5.25z" />
                </svg>
                <span>Google Play</span>
              </a>
              <a href="#" className="app-store-link app-store">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 13.5c-.73 0-1.38.35-1.79.88.79 1.16 1.3 2.53 1.3 4.02 0 1.5-.51 2.87-1.3 4.04.41.53 1.06.88 1.79.88 1.97 0 3.57-1.6 3.57-3.57S19.02 13.5 17.05 13.5zM6.95 13.5C4.98 13.5 3.4 15.1 3.4 17.07s1.58 3.57 3.55 3.57c.73 0 1.38-.35 1.79-.88-.79-1.16-1.3-2.53-1.3-4.04 0-1.5.51-2.87 1.3-4.04-.41-.54-1.06-.88-1.79-.88zm10.1-6.57c0-1.97-1.6-3.57-3.57-3.57-.73 0-1.38.35-1.79.88.79 1.16 1.3 2.53 1.3 4.02 0 1.5-.51 2.87-1.3 4.04.41.53 1.06.88 1.79.88 1.97 0 3.57-1.6 3.57-3.57z" />
                </svg>
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <p>&copy; {currentYear} Mirage. All rights reserved.</p>
          </div>
          <div className="footer__bottom-center">
            <span className="footer__badge">v0.9.1</span>
          </div>
          <div className="footer__bottom-right">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer__divider">•</span>
            <Link to="/terms">Terms of Service</Link>
            <span className="footer__divider">•</span>
            <Link to="/legals">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
