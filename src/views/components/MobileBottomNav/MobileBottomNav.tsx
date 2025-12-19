import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import "./MobileBottomNav.css";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  hideWhenNotSubscribed?: boolean;
}

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ShowsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

const MoviesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
);

const FavoritesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SubscribeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, isSubscriber } = useAuth();

  // Determine if we should show the subscribe button
  const showSubscribe = !isAuthenticated || !isSubscriber;

  const navItems: NavItem[] = [
    { path: "/", label: "Accueil", icon: <HomeIcon /> },
    { path: "/browse/shows", label: "Séries", icon: <ShowsIcon /> },
    { path: "/browse/movies", label: "Films", icon: <MoviesIcon /> },
    // Show Favorites only for authenticated subscribers
    { path: "/my-list", label: "Favoris", icon: <FavoritesIcon />, requiresAuth: true, hideWhenNotSubscribed: true },
    // Show Subscribe button when not authenticated or not subscribed
    ...(showSubscribe ? [{ path: "/subscribe", label: "S'abonner", icon: <SubscribeIcon /> }] : []),
    // Profile/Login button
    { path: isAuthenticated ? "/profile" : "/login", label: isAuthenticated ? "Profil" : "Connexion", icon: <ProfileIcon /> },
  ];

  // Filter items based on auth and subscription status
  const filteredItems = navItems.filter((item) => {
    // Hide items that require auth for non-authenticated users
    if (item.requiresAuth && !isAuthenticated) {
      return false;
    }
    // Hide items marked as hideWhenNotSubscribed for non-subscribers
    if (item.hideWhenNotSubscribed && !isSubscriber) {
      return false;
    }
    return true;
  });

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="mobile-bottom-nav">
      {filteredItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`mobile-bottom-nav__item ${isActive(item.path) ? "mobile-bottom-nav__item--active" : ""} ${item.path === "/subscribe" ? "mobile-bottom-nav__item--subscribe" : ""}`}
        >
          <span className="mobile-bottom-nav__icon">{item.icon}</span>
          <span className="mobile-bottom-nav__label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
