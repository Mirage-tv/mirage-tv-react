import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUseCase } from "../../../infrastructure/config/dependencies";
import { useStore } from "../../../infrastructure/store";
import "./SigninPage.css";

export const SignupPage = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const setLoading = useStore((state) => state.setLoading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      setLoading(true);
      const user = await signupUseCase.execute(email, password, name);
      setUser(user);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Créer un compte</h1>
        {error && <div className="auth-card__error">{error}</div>}
        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="auth-card__field">
            <label htmlFor="name" className="auth-card__label">
              Nom
            </label>
            <input id="name" type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="auth-card__field">
            <label htmlFor="email" className="auth-card__label">
              Email
            </label>
            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="auth-card__field">
            <label htmlFor="password" className="auth-card__label">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary auth-card__submit">
            S'inscrire
          </button>
        </form>
        <p className="auth-card__footer">
          Déjà un compte ?{" "}
          <Link to="/signin" className="auth-card__link">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};
