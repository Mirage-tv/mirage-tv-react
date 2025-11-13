import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import "./SignUpPage.css";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    mail: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError(null);
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name || !formData.mail || !formData.password || !formData.confirmPassword) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    if (!formData.mail.includes("@")) {
      setFormError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas.");
      return;
    }

    const result = await signUp({
      name: formData.name,
      mail: formData.mail,
      password: formData.password,
    });

    if (result.success) {
      navigate("/");
    } else {
      setFormError(result.error || "Erreur lors de la création du compte. Veuillez réessayer.");
    }
  };

  return (
    <div className="sign-up-page__bg">
      <div className="sign-up-page__center">
        <div className="sign-up-page__card">
          <h1 className="sign-up-page__title">Créer un compte Mirage-TV</h1>
          <p className="sign-up-page__subtitle">Rejoignez Mirage-TV et profitez de tous les contenus</p>
          <form onSubmit={handleSubmit} className="sign-up-page__form">
            <div className="sign-up-page__form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jean Dupont"
                required
                disabled={isLoading}
              />
            </div>
            <div className="sign-up-page__form-group">
              <label htmlFor="mail">Adresse e-mail</label>
              <input
                id="mail"
                name="mail"
                type="email"
                value={formData.mail}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div className="sign-up-page__form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Au moins 6 caractères"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
            <div className="sign-up-page__form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmez votre mot de passe"
                required
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
            {(formError || error) && <div className="sign-up-page__error-message">{formError || error}</div>}
            <button type="submit" className="sign-up-page__btn-submit" disabled={isLoading}>
              {isLoading ? "Création du compte..." : "S'inscrire"}
            </button>
          </form>
          <div className="sign-up-page__footer">
            <span>Déjà un compte ? </span>
            <Link to="/login" className="sign-up-page__link-login">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
