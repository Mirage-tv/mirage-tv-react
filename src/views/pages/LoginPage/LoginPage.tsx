import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../core/hooks";
import "./LoginPage.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    mail: "",
    password: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (formError) setFormError(null);
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Validation côté client
    if (!formData.mail || !formData.password) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    if (!formData.mail.includes("@")) {
      setFormError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    // Tentative de connexion
    const result = await login({
      mail: formData.mail,
      password: formData.password,
    });

    if (result.success) {
      navigate("/");
    } else {
      setFormError(result.error || "Échec de la connexion. Veuillez réessayer.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-page__bg">
      <div className="login-page__center">
        <div className="login-page__card">
          <h1 className="login-page__title">Connexion à Mirage-TV</h1>
          <p className="login-page__subtitle">Connectez-vous pour profiter de tous les contenus</p>
          <form onSubmit={handleSubmit} className="login-page__form">
            <div className="login-page__form-group">
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
            <div className="login-page__form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Votre mot de passe"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            {(formError || error) && <div className="login-page__error-message">{formError || error}</div>}
            <button type="submit" className="login-page__btn-submit" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
            <button type="button" className="login-page__btn-forgot-password" onClick={handleForgotPassword} disabled={isLoading}>
              Mot de passe oublié ?
            </button>
          </form>
          <div className="login-page__footer">
            <span>Pas encore de compte ? </span>
            <Link to="/signup" className="login-page__link-signup">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
