import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signinUseCase } from "../../infrastructure/config/dependencies";
import { useStore } from "../../infrastructure/store";
import "./SigninPage.css";

export const SigninPage = () => {
  const navigate = useNavigate();
  const { setUser, setLoading } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const user = await signinUseCase.execute(email, password);
      setUser(user);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Connexion à Mirage</h1>

        {error && <div className="auth-card__error">{error}</div>}

        <form className="auth-card__form" onSubmit={handleSubmit}>
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
            Se connecter
          </button>
        </form>

        <p className="auth-card__footer">
          Pas de compte ?{" "}
          <Link to="/signup" className="auth-card__link">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};
