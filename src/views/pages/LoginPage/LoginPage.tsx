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
    if (formError) setFormError(null);
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.mail || !formData.password) {
      setFormError("Veuillez remplir tous les champs.");
      return;
    }

    if (!formData.mail.includes("@")) {
      setFormError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

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

  return (
    <div className="login-page">
      <div className="login-page__container">
        <h1 className="login-page__title">Connexion</h1>
        <p className="login-page__subtitle">Accédez à votre compte pour continuer.</p>

        {(formError || error) && <div className="login-page__error-message">{formError || error}</div>}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="login-page__btn-submit" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="login-page__footer">
          <p>
            Pas encore de compte ?{" "}
            <Link to="/signup" className="login-page__link-signup">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
