import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { SubscriptionDTO } from "../../../core/domain/types";
import { useAuth } from "../../../core/hooks";
import { subscriptionService, userService } from "../../../infrastructure/adapters/api";
import "./AccountPage.css";

type ActiveSection = "profile" | "email" | "password" | "subscription" | "delete";

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshProfile } = useAuth();

  const [activeSection, setActiveSection] = useState<ActiveSection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Subscription state
  const [subscription, setSubscription] = useState<SubscriptionDTO | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Form states
  const [newName, setNewName] = useState(user?.name || "");
  const [newEmail, setNewEmail] = useState(user?.mail || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // Load subscription data
  useEffect(() => {
    if (isAuthenticated) {
      loadSubscription();
    }
  }, [isAuthenticated]);

  const loadSubscription = async () => {
    setSubscriptionLoading(true);
    try {
      const sub = await subscriptionService.getSubscription();
      setSubscription(sub);
    } catch {
      // User might not have a subscription, that's OK
      setSubscription(null);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const clearMessages = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleUpdateName = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!newName.trim()) {
      setErrorMessage("Le nom ne peut pas être vide.");
      return;
    }

    setIsLoading(true);
    try {
      await userService.updateName({ name: newName.trim() });
      await refreshProfile();
      setSuccessMessage("Votre nom a été mis à jour avec succès.");
      setActiveSection(null);
    } catch {
      setErrorMessage("Impossible de mettre à jour le nom. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!newEmail.trim() || !newEmail.includes("@")) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    setIsLoading(true);
    try {
      await userService.updateEmail({ mail: newEmail.trim() });
      await refreshProfile();
      setSuccessMessage("Votre adresse e-mail a été mise à jour avec succès.");
      setActiveSection(null);
    } catch {
      setErrorMessage("Impossible de mettre à jour l'e-mail. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (newPassword.length < 6) {
      setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      await userService.updatePassword({ password: newPassword });
      setSuccessMessage("Votre mot de passe a été mis à jour avec succès.");
      setNewPassword("");
      setConfirmPassword("");
      setActiveSection(null);
    } catch {
      setErrorMessage("Impossible de mettre à jour le mot de passe. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    clearMessages();

    if (!confirm("Êtes-vous sûr de vouloir annuler votre abonnement ? Vous garderez l'accès jusqu'à la fin de la période en cours.")) {
      return;
    }

    setIsLoading(true);
    try {
      if (subscription?.id) {
        await subscriptionService.cancelSubscription({ id: subscription.id });
        setSuccessMessage("Votre abonnement a été annulé. Il restera actif jusqu'à la fin de la période en cours.");
        await loadSubscription();
        await refreshProfile();
      }
    } catch {
      setErrorMessage("Impossible d'annuler l'abonnement. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (deleteConfirm !== "SUPPRIMER") {
      setErrorMessage("Veuillez taper SUPPRIMER pour confirmer.");
      return;
    }

    setIsLoading(true);
    try {
      await userService.deleteAccount();
      await logout();
      navigate("/");
    } catch {
      setErrorMessage("Impossible de supprimer le compte. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  const toggleSection = (section: ActiveSection) => {
    clearMessages();
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      // Reset form values
      setNewName(user?.name || "");
      setNewEmail(user?.mail || "");
      setNewPassword("");
      setConfirmPassword("");
      setDeleteConfirm("");
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "active":
        return "Actif";
      case "cancelled":
        return "Annulé";
      case "expired":
        return "Expiré";
      case "gracePeriod":
        return "Période de grâce";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case "active":
        return "";
      case "cancelled":
        return "account-page__subscription-status--cancelled";
      case "expired":
        return "account-page__subscription-status--expired";
      default:
        return "";
    }
  };

  const hasActiveSubscription = subscription && (subscription.status === "active" || subscription.status === "gracePeriod");
  const isCancelled = subscription?.status === "cancelled";

  return (
    <div className="account-page">
      <div className="account-page__container">
        <button className="account-page__back-btn" onClick={() => navigate("/profile")}>
          ← Retour au profil
        </button>

        <h1 className="account-page__title">Paramètres du compte</h1>

        {successMessage && <div className="account-page__message account-page__message--success">{successMessage}</div>}

        {errorMessage && <div className="account-page__message account-page__message--error">{errorMessage}</div>}

        {/* Profile Section */}
        <div className="account-page__section">
          <div className="account-page__section-header" onClick={() => toggleSection("profile")}>
            <div className="account-page__section-info">
              <h2 className="account-page__section-title">Informations du profil</h2>
              <p className="account-page__section-value">{user?.name}</p>
            </div>
            <button className="account-page__edit-btn">{activeSection === "profile" ? "Annuler" : "Modifier"}</button>
          </div>

          {activeSection === "profile" && (
            <form className="account-page__form" onSubmit={handleUpdateName}>
              <div className="account-page__form-group">
                <label htmlFor="name">Nouveau nom</label>
                <input
                  id="name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Votre nom"
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="account-page__submit-btn" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          )}
        </div>

        {/* Email Section */}
        <div className="account-page__section">
          <div className="account-page__section-header" onClick={() => toggleSection("email")}>
            <div className="account-page__section-info">
              <h2 className="account-page__section-title">Adresse e-mail</h2>
              <p className="account-page__section-value">{user?.mail}</p>
            </div>
            <button className="account-page__edit-btn">{activeSection === "email" ? "Annuler" : "Modifier"}</button>
          </div>

          {activeSection === "email" && (
            <form className="account-page__form" onSubmit={handleUpdateEmail}>
              <div className="account-page__form-group">
                <label htmlFor="email">Nouvelle adresse e-mail</label>
                <input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="votre@email.com"
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="account-page__submit-btn" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          )}
        </div>

        {/* Password Section */}
        <div className="account-page__section">
          <div className="account-page__section-header" onClick={() => toggleSection("password")}>
            <div className="account-page__section-info">
              <h2 className="account-page__section-title">Mot de passe</h2>
              <p className="account-page__section-value">••••••••</p>
            </div>
            <button className="account-page__edit-btn">{activeSection === "password" ? "Annuler" : "Modifier"}</button>
          </div>

          {activeSection === "password" && (
            <form className="account-page__form" onSubmit={handleUpdatePassword}>
              <div className="account-page__form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6+ caractères"
                  disabled={isLoading}
                />
              </div>
              <div className="account-page__form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez le mot de passe"
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="account-page__submit-btn" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>
          )}
        </div>

        {/* Subscription Section */}
        <div className="account-page__section">
          <div className="account-page__section-header" onClick={() => toggleSection("subscription")}>
            <div className="account-page__section-info">
              <h2 className="account-page__section-title">Abonnement</h2>
              <p className="account-page__section-value">
                {subscriptionLoading ? "Chargement..." : hasActiveSubscription ? subscription?.planName : "Aucun abonnement actif"}
              </p>
            </div>
            <button className="account-page__edit-btn">{activeSection === "subscription" ? "Fermer" : "Gérer"}</button>
          </div>

          {activeSection === "subscription" && (
            <div className="account-page__subscription-content">
              {subscriptionLoading ? (
                <div className="account-page__loading">
                  <div className="account-page__loading-spinner"></div>
                  <span>Chargement de l'abonnement...</span>
                </div>
              ) : (hasActiveSubscription || isCancelled) && subscription ? (
                <>
                  <div className="account-page__subscription-info">
                    <div className="account-page__subscription-badge">
                      <span className="account-page__subscription-plan">{subscription.planName}</span>
                      <span className={`account-page__subscription-status ${getStatusClass(subscription.status)}`}>
                        {getStatusLabel(subscription.status)}
                      </span>
                    </div>
                    <p className="account-page__subscription-desc">Vous bénéficiez d'un accès illimité à tout le catalogue Mirage.</p>

                    <div className="account-page__subscription-details">
                      <p>
                        <strong>Prix :</strong> {formatPrice(subscription.price)}
                      </p>
                      <p>
                        <strong>Date de début :</strong> {formatDate(subscription.startDate)}
                      </p>
                      {subscription.endDate && (
                        <p>
                          <strong>{isCancelled ? "Fin d'accès :" : "Prochain renouvellement :"}</strong> {formatDate(subscription.endDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  {hasActiveSubscription && (
                    <button className="account-page__cancel-btn" onClick={handleCancelSubscription} disabled={isLoading}>
                      {isLoading ? "Annulation..." : "Annuler l'abonnement"}
                    </button>
                  )}

                  {isCancelled && subscription.endDate && (
                    <p className="account-page__subscription-cancelled-note">
                      Votre abonnement est annulé mais reste actif jusqu'au {formatDate(subscription.endDate)}.
                    </p>
                  )}
                </>
              ) : (
                <div className="account-page__no-subscription">
                  <p>Vous n'avez pas d'abonnement actif.</p>
                  <button className="account-page__subscribe-btn" onClick={() => navigate("/subscribe")}>
                    Voir les offres
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete Account Section */}
        <div className="account-page__section account-page__section--danger">
          <div className="account-page__section-header" onClick={() => toggleSection("delete")}>
            <div className="account-page__section-info">
              <h2 className="account-page__section-title account-page__section-title--danger">Supprimer le compte</h2>
              <p className="account-page__section-value">Action irréversible</p>
            </div>
            <button className="account-page__edit-btn account-page__edit-btn--danger">
              {activeSection === "delete" ? "Annuler" : "Supprimer"}
            </button>
          </div>

          {activeSection === "delete" && (
            <form className="account-page__form account-page__form--danger" onSubmit={handleDeleteAccount}>
              <div className="account-page__warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <strong>Attention !</strong>
                  <p>Cette action est irréversible. Toutes vos données seront définitivement supprimées.</p>
                </div>
              </div>
              <div className="account-page__form-group">
                <label htmlFor="deleteConfirm">Tapez SUPPRIMER pour confirmer</label>
                <input
                  id="deleteConfirm"
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="SUPPRIMER"
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="account-page__delete-btn" disabled={isLoading || deleteConfirm !== "SUPPRIMER"}>
                {isLoading ? "Suppression..." : "Supprimer définitivement mon compte"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
