import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import "./ProfilePage.css";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <h1 className="profile-page__title">Mon Profil</h1>

        <div className="profile-page__card">
          <div className="profile-page__avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="profile-page__info">
            <div className="profile-page__info-item">
              <label className="profile-page__label">Nom</label>
              <p className="profile-page__value">{user?.name || "Utilisateur"}</p>
            </div>

            <div className="profile-page__info-item">
              <label className="profile-page__label">Email</label>
              <p className="profile-page__value">{user?.mail || "Non renseigné"}</p>
            </div>

            {user?.planName && (
              <div className="profile-page__info-item">
                <label className="profile-page__label">Abonnement</label>
                <p className="profile-page__value profile-page__value--plan">{user.planName}</p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-page__actions">
          <button
            className="profile-page__btn profile-page__btn--secondary"
            onClick={() => navigate("/account")}
          >
            Paramètres du compte
          </button>

          <button
            className="profile-page__btn profile-page__btn--logout"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Déconnexion..." : "Se déconnecter"}
          </button>
        </div>
      </div>
    </div>
  );
};
