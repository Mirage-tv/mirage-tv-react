import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './Footer.css';

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
            <p className="footer__tagline">Votre destination ultime pour les films, séries et contenus exclusifs en streaming.</p>
            <div className="footer__socials">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="social-icon"
                title="Suivez-nous sur X"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-icon"
                title="Suivez-nous sur Instagram"
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
                title="Abonnez-vous sur YouTube"
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
                title="Suivez-nous sur TikTok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Browse Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Explorer</h4>
            <ul className="footer__links-list">
              <li>
                <Link to="/browse/movies">Films</Link>
              </li>
              <li>
                <Link to="/browse/shows">Séries TV</Link>
              </li>
              <li>
                <Link to="/browse/category/original">Séries Originales</Link>
              </li>
              <li>
                <Link to="/browse/category/documentary">Documentaires</Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Assistance</h4>
            <ul className="footer__links-list">
              <li>
                <Link to="/about">À propos</Link>
              </li>
              <li>
                <Link to="/pricing">Tarifs & Abonnements</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <a href="mailto:admin@mirage-tv.com">admin@mirage-tv.com</a>
              </li>
            </ul>
          </div>

          {/* Account Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Compte</h4>
            <ul className="footer__links-list">
              <li>
                <Link to="/account">Paramètres du compte</Link>
              </li>
              <li>
                <Link to="/billing">Facturation & Paiements</Link>
              </li>
              <li>
                <Link to="/help">Centre d'aide</Link>
              </li>
              <li>
                <Link to="/preferences">Préférences</Link>
              </li>
            </ul>
          </div>

          {/* Apps Section */}
          <div className="footer__section footer__apps">
            <h4 className="footer__section-title">Télécharger l'application</h4>
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
            <p>&copy; {currentYear} Mirage. Tous droits réservés.</p>
          </div>
          <div className="footer__bottom-center">
            <span className="footer__badge">v0.9.9</span>
          </div>
          <div className="footer__bottom-right">
            <Link to="/privacy">Politique de confidentialité</Link>
            <span className="footer__divider">•</span>
            <Link to="/terms">Conditions d'utilisation</Link>
            <span className="footer__divider">•</span>
            <Link to="/legals">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
